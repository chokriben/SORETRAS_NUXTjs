<template>
  <VForm @submit.prevent="handleSubmit">
    <VSnackbar v-model="snackbar.show" :color="snackbar.color" position>
      {{ snackbar.message }}
    </VSnackbar>
    <VRow>
      <VCol cols="6">
        <VTextField v-model="name" prepend-inner-icon="mdi-office-building" label="Nom" placeholder="Nom" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="description" prepend-inner-icon="mdi-office-building" label="Description"
          placeholder="Description" />
      </VCol>
      <VCol cols="12">
        <VBtn type="submit" class="me-2" v-if="!isEditMode">
          Ajouter
        </VBtn>
        <VBtn type="submit" class="me-2" v-else>
          Modifier
        </VBtn>
        <VBtn color="secondary" type="reset" variant="tonal" @click="handleReset">
          Réinitialiser
        </VBtn>
      </VCol>
    </VRow>
    <VDataTable :headers="headers" :items="presentations" :search="search" :loading="isLoading" hide-default-footer>
      <template v-slot:item="{ item }">
        <div class="d-flex">
          <VIconButton small @click="editPresentation(item)">
            <VIcon>mdi-pencil</VIcon>
          </VIconButton>
          <VIconButton small color="error" @click="deletePresentation(item.id)">
            <VIcon>mdi-delete</VIcon>
          </VIconButton>
        </div>
      </template>
    </VDataTable>

  </VForm>
</template>

<script>
import { ref } from 'vue'
import useAxios from '~/hooks/useAxios'

export default {
  setup() {
    const { postData, getData, putData, deleteData } = useAxios()
    const description = ref('')
    const name = ref('')
    const presentations = ref([])
    const isLoading = ref(false)
    const isEditMode = ref(false)
    const search = ref('')
    const headers = [
      { text: 'Nom', value: 'name' },
      { text: 'Description', value: 'description' },
      { text: 'Actions', value: 'actions', sortable: false },
    ]
    const snackbar = ref({ show: false, message: '', color: '' })

    const resetForm = () => {
      description.value = ''
      name.value = ''
    }

    const handleReset = () => {
      isEditMode.value = false
      resetForm()
    }

    const handleSubmit = async () => {
      const payload = {
        name_fr: name.value,
        name_ar: name.value,
        name_en: name.value,
        description_fr: description.value,
        description_ar: description.value,
        description_en: description.value,
      }

      try {
        if (isEditMode.value) {
          // Make the PUT request for update
          await putData(`https://api.srtk.com.tn/api/presentation/update/${presentationId}`, payload)
          snackbar.value = {
            show: true,
            message: 'Mise à jour réussie!',
            color: 'success',
          }
        } else {
          // Make the POST request for create
          await postData('https://api.srtk.com.tn/api/presentation/add', payload)
          snackbar.value = {
            show: true,
            message: 'Enregistrement réussi!',
            color: 'success',
          }
        }

        resetForm()
        isEditMode.value = false
        await fetchPresentations()
      } catch (error) {
        console.error(error)
        snackbar.value = {
          show: true,
          message: 'Échec de l\'enregistrement!',
          color: 'error',
        }
      }
    }

    const fetchPresentations = async () => {
      try {
        isLoading.value = true
        const response = await getData('https://api.srtk.com.tn/api/presentation')
        presentations.value = response.data
      } catch (error) {
        console.error(error)
      } finally {
        isLoading.value = false
      }
    }

    const deletePresentation = async (presentationId) => {
      try {
        await deleteData(`https://api.srtk.com.tn/api/presentation/delete/${presentationId}`)
        snackbar.value = {
          show: true,
          message: 'Suppression réussie!',
          color: 'success',
        }
        await fetchPresentations()
      } catch (error) {
        console.error(error)
        snackbar.value = {
          show: true,
          message: 'Échec de la suppression!',
          color: 'error',
        }
      }
    }

    const editPresentation = (presentation) => {
      isEditMode.value = true
      presentationId = presentation.id
      name.value = presentation.name_fr
      description.value = presentation.description_fr
    }

    fetchPresentations()

    return {
      description,
      name,
      presentations,
      isLoading,
      isEditMode,
      search,
      headers,
      snackbar,
      resetForm,
      handleReset,
      handleSubmit,
      deletePresentation,
      editPresentation,
    }
  },
}
</script>

<style lang="scss" scoped></style>
