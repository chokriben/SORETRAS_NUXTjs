<template>
  <!-- loading="blue-darken-1" -->
  <v-card :title="$t('widget.evenements')" subtitle="2023">
    <v-timeline side="end" align="start">
      <v-timeline-item v-for="(item, index) in items" :key="index" :dot-color="index === 0 ? 'logo' : undefined"
        size="small">
        <div class="d-flex">
          <strong class="me-4">{{ item.date }}</strong>
          <div>
            <strong>{{ item.title }}</strong>
            <div class="text-caption">
              {{ item.description }}
            </div>
          </div>
        </div>
      </v-timeline-item>


    </v-timeline>
    <v-card-actions>
      <v-spacer></v-spacer>
      <router-link to="/evenement">

        <v-btn variant="outlined" color="#0383ff">voir plus</v-btn>
      </router-link>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  data() {
    return {
      items: [
        // Your items to display
        { date: "06/03 ", title: 'Event 1', description: "Lorem ipsum dolor sit amet consectetur." },
        { date: "05/03 ", title: 'Event 2', description: "Lorem ipsum dolor sit amet consectetur." },
        // Add other items
      ],
    };
  },

};
</script>
