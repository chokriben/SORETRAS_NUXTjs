<template>
  <div id="res">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-3 pa-4">
            <h1 class="text-center">Order Form</h1>
            <v-form @submit="submitForm">
              <v-text-field v-model="customer.fname" label="Nom" name="fname" required></v-text-field>
              <v-text-field v-model="customer.lname" label="Prenom" name="lname" required></v-text-field>
              <v-text-field v-model="customer.adresse" label="Adress" name="adresse" required></v-text-field>
              <v-text-field v-model="customer.email" label="Email" name="email" required></v-text-field>
              <v-text-field v-model="customer.phone" label="Phone number" name="phone" required></v-text-field>

              <v-text-field v-model="order.orderid" label="Order ID" name="orderid" required></v-text-field>
              <v-text-field v-model="order.amount" label="Order amount" name="amount" required></v-text-field>

              <v-select v-model="order.currency" :items="currencies" label="Currency" required></v-select>

              <v-btn type="submit" color="primary" block>Send</v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";
export default {
  head() {
    return {
      script: [
        {
          src: "https://tnpost.gateway.mastercard.com/checkout/version/62/checkout.js",
          "data-error": "errorCallback",
          "data-cancel": "cancelCallback",
        },
      ],
    };
  },
  data() {
    return {
      currencies: ["TND"],
      customer: {
        fname: "",
        lname: "",
        adresse: "",
        email: "",
        phone: "",
      },
      order: {
        orderid: "",
        amount: "",
        currency: "",
      },
      showResult: false, // Add a flag to track whether to show the result or the form
      apiResponse: "", // Store the API response here
      htmlContent: "",
    };
  },
  methods: {
    async submitForm(event) {
      event.preventDefault();
      try {
        const response = await axios.post(
          "https://api.srtk.com.tn/api/paiement",
          {
            merchentid: this.order.merchentid,
            passwd: this.order.passwd,
            ...this.merchant,
            ...this.customer,
            ...this.order,
          }
        );

        // Check if the response contains both JSON data and HTML content
        const responseText = response.data;
        const htmlSeparator = "<html>"; // Adjust the HTML separator based on the actual response
        const indexOfHtmlSeparator = responseText.indexOf(htmlSeparator);

        if (indexOfHtmlSeparator !== -1) {
          const jsonData = responseText.substring(0, indexOfHtmlSeparator);
          const htmlContent = responseText.substring(indexOfHtmlSeparator);

          // Parse the JSON data and store it in apiResponse
          this.apiResponse = JSON.parse(jsonData);

          // Now you can use the parsed JSON data and display the HTML content as needed.
          //  //console.log('Parsed JSON:', this.apiResponse);
          document.getElementById("res").innerHTML =
            jsonData + "<br>" + htmlContent;
          // //console.log('HTML Content:', htmlContent);
        } else {
          console.error("Invalid API response:", response);
        }

        // If you want to display the HTML content as well, you can store it in another variable
        // and bind it in your template.
      } catch (error) {
        console.error("Error creating session:", error);
      }
    },
  },
};
</script>
