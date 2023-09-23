<template>
    <label
        style="    background: linear-gradient(to top, #0655a0, #0477e2) !important;cursor: pointer;margin-top:5px;padding:10px;border-radius:10px;color:white;">
        Télécharger votre image <input type="file" hidden @change="upload($event.target.files)">
    </label>
</template>

<script lang="ts">
import axios from 'axios';
import { SetupContext } from 'vue';

export default {
    name: "ImageUpload",
    emits: ['uploaded'],
    setup(props: any, context: SetupContext) {
        const upload = async (files: FileList | null) => {
            if (files === null) return;

            const formData = new FormData();
            formData.append('image', files[0]);

            const { data } = await axios.post('https://api.srtk.com.tn/api/upload', formData);

            context.emit('uploaded', data.url);
        }

        return {
            upload
        }
    }
}
</script>