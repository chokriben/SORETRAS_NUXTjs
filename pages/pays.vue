<template>
  <div>
    <h1>Order Form</h1>
    <form @submit.prevent="createSession">
      <v-text-field v-model="customer.fname" label="Nom" name="fname" required></v-text-field>
      <v-text-field v-model="customer.lname" label="Prenom" name="lname" required></v-text-field>
      <v-text-field v-model="customer.adresse" label="Adress" name="adresse" required></v-text-field>
      <v-text-field v-model="customer.email" label="  email" name="email" required></v-text-field>

      <v-text-field v-model="customer.phone" label="Phone number" name="phone" required></v-text-field>
      <v-text-field v-model="order.orderid" label="Order ID" name="orderid" required></v-text-field>
      <v-text-field v-model="order.amount" label=" amount" name="amount" required type="number"></v-text-field>
      <v-select v-model="order.currency" :items="currencies" label="Currency" required></v-select>

      <v-btn color="primary" type="submit" v-if="!paymentSessionId">Create Payment Session</v-btn>
    </form>
    <div v-if="paymentSessionId">
      <h3>Payment Session ID:</h3>
      <p>{{ paymentSessionId }}</p>

      <v-btn color="primary" @click="redirectToPaymentPage">Pay with Payment Page</v-btn>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const currencies = ["TND"];
const customer = ref({
  fname: "",
  lname: "",
  adresse: "",
  email: "",
  phone: "",
});

const order = ref({
  orderid: "",
  amount: "",
  currency: "",
  returnUrl: "https://api.srtk.com.tn/api/recue_paiement?orderid=" + num_order,
});

const merchant = {
  merchentid: 1751000728,
  login: "SRTK_user", // Add the correct login
  passwd: "0b755af420c06f7ef4d82ea5403a1082",
};

const paymentSessionId = ref(""); // Initialize paymentSessionId with an empty string
const backendResult = ref({});

function loadMastercardCheckoutScript() {
  const script = document.createElement("script");
  script.src =
    "https://tnpost.gateway.mastercard.com/checkout/version/62/checkout.js";

  document.head.appendChild(script);

  // Wait for the script to load before using the Checkout object
  script.onload = () => {
    redirectToPaymentPage();
  };
}
onMounted(() => {
  // Load the Mastercard Checkout script when the component is mounted
  loadMastercardCheckoutScript();
});
async function createSession() {
  try {
    const response = await axios.post("https://api.srtk.com.tn/api/payement", {
      login: merchant.login,
      passwd: merchant.passwd,
      ...merchant,
      ...customer.value,

      ...order.value,
    });
    if (
      response.data &&
      response.data.result === "SUCCESS" &&
      response.data.session &&
      response.data.session.id
    ) {
      const sessionId = response.data.session.id;
      paymentSessionId.value = sessionId; // Update the paymentSessionId here
      backendResult.value = response.data;
    } else {
      console.error("Invalid API response:", response.data);
    }
  } catch (error) {
    console.error(error);
  }
}

function redirectToPaymentPage() {
  if (!paymentSessionId.value) {
    console.error("Payment Session ID is missing.");
    return;
  }

  const paymentPageUrl = `https://tnpost.gateway.mastercard.com/checkout/pay/${paymentSessionId.value}`;

  try {
    // Redirect the user to the payment page
    Checkout.configure({
      merchant: `${merchant.merchentid}`,
      session: {
        id: paymentSessionId.value,
      },
      order: {
        amount: order.amount,

        currency: order.currency,
        description:
          "Payer pour la commande #" + order.orderid + " via Carte de crédit",
        customerOrderDate: "2022-09-22",
        customerReference: "0",
        reference: `REF-${order.orderid}`,
        id: order.orderid,
      },
      transaction: {
        reference: `TRF${order.orderid}`,
      },
      customer: {
        firstName: customer.fname,
        lastName: customer.lname,
        email: customer.email,
        mobilePhone: "+216 98 123 123",
        phone: customer.phone,
      },
      billing: {
        address: {
          city: "Tunis",
          country: "TUN",
          postcodeZip: "1023",
          stateProvince: "Tunis",
          street: "tunis rue 00",
          street2: "rue hedi nuira tunis",
        },
      },
      interaction: {
        merchant: {
          name: "SRT-Kasserine",
          address: {
            line1: "",
            line2: "",
          },
        },
        locale: "fr_FR",
        displayControl: {
          billingAddress: "HIDE",
          customerEmail: "OPTIONAL",
          orderSummary: "HIDE",
          shipping: "HIDE",
        },
      },
      amount: parseFloat(order.amount),
    });
    Checkout.showPaymentPage(); // Show the payment page using the configured options
  } catch (error) {
    console.error(
      "Error redirecting to Mastercard Payment Page:",
      error.message
    );
    // Implement a fallback mechanism here, e.g., display an error message to the user.
  }
}
</script>
