<template>
    <v-row class="mt-3">
        <v-col cols="12" md="6" class="d-flex  align-center soc-foot"
            style="padding:3px 25px;background-color: #333333;justify-content:flex-start">
            <img width=" 350" src="/images/logo-55-white.png">

        </v-col>
        <v-col cols="12" md="6" class="d-flex  align-center soc-foot"
            style="padding:3px 25px;background-color: #333333;justify-content:flex-end;font-size:13px">

            <a v-if="fcb !== '' && fcb !== null" :href="fcb"> <v-icon class="m-2 mt-0 mp-0 social-icon fb" color="white"
                    size="x-large" icon="mdi-facebook"></v-icon></a>
            <a v-if="ytb !== '' && ytb !== null" :href="ytb"> <v-icon class="m-2 mt-0 mp-0 social-icon yt" color="white"
                    size="x-large" icon="mdi-youtube"></v-icon></a>
            <a v-if="tweet !== '' && tweet !== null" :href="tweet"> <v-icon class="m-2 mt-0 mp-0 social-icon tw"
                    color="white" size="x-large" icon="mdi-twitter"></v-icon></a>


        </v-col>
    </v-row>
    <v-footer class="bg-footer d-flex flex-column " style="padding:20px 10px ;">


        <v-row class="p-12 w-100">

            <v-col cols="12" md="3">

                <v-col cols="12" style="color:white !important;" class="   mb-6 ">
                    <div> <v-icon class="m-2 mt-0 mp-0 social-icon map" color="white" size="large"
                            icon="mdi-phone"></v-icon>
                        (+216) {{ num_telstef }}
                    </div>
                    <div> <v-icon class="m-2 mt-0 mp-0 social-icon map" color="white" size="large"
                            icon="mdi-email"></v-icon>
                        <a :href="'mailto:' + mailstef">{{ mailstef }}</a>
                    </div>
                    <div> <v-icon class="m-2 mt-0 mp-0 social-icon map" color="white" size="large"
                            icon="mdi-map-marker"></v-icon>
                        {{ adr_stef }}
                    </div>
                </v-col>

            </v-col>
            <v-col cols="12" md="6">
                <v-row>
                    <v-col cols="5" class="pl-12 ">
                        <h2 class="title-footer">Menu</h2>
                        <ul>

                            <li class="list-footer"><a href="/">Acceuil</a> </li>
                            <li class="list-footer"><a href="/presentation">Présentation</a> </li>
                            <li class="list-footer"><a href="/actualite">Actualités</a> </li>
                            <li class="list-footer"><a href="/evenement">Evennements</a> </li>
                            <li class="list-footer"><a href="/contact">Contact</a> </li>
                        </ul>
                    </v-col>
                    <v-col cols="7">
                        <h2 class="title-footer">Services</h2>
                        <ul>
                            <li class="list-footer"><a href="/urbain">Abonnement scolaire</a> </li>
                            <li class="list-footer"><a href="/reservation">Réservation</a> </li>
                            <li class="list-footer"><a href="/horaire">Horaires</a></li>
                        </ul>

                    </v-col>


                </v-row>

            </v-col>

            <v-col cols="12" md="3">
                <div class="newsletter-area d-flex flex-column ">
                    <h2 class="title-footer">Inscrivez-vous à la newsletter</h2>
                    <v-row class="justify-end">
                        <v-col cols="12" sm="12" style="text-align:left;">
                            <v-form @submit.prevent="newsletter">
                                <input type="email" v-model="email" class="input-footer" placeholder="Email" variant="solo">

                                <v-btn class="justify-start bt elevation-0 btn-footer rounded-0" color="#fff"
                                    :loading="loading[1]" :disabled="loading[1]" @click="load(1)">S'inscrire</v-btn>
                            </v-form>


                        </v-col>
                        <!-- <v-col cols="12" sm="2">
                            <img class="bus-img-newsletter" src="/images/newsletter-img.png" alt="newsletter image">
                        </v-col> -->

                    </v-row>


                </div>

            </v-col>




        </v-row>
    </v-footer>
    <v-row>
        <v-col cols="12" class="bg-copyright text-center mt-2 pb-2" style="height:35px; font-size:13px;">
            Copyright <v-icon>mdi-copyright </v-icon> 2023 SRTK. Designed By
            <a href="#" target="_blank">ICS</a> </v-col>
    </v-row>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import useAxios from '~/hooks/useAxios';
import axios from 'axios';
export default {
    data() {
        return {
            loading: [],
            email: '',
            num_telstef: '',
            mailstef: '',
            namestef: '',
            adr_stef: '',
            fcb: '',
            tweet: '',
            ytb: '',
        }
    },
    methods: {
        load(i) {
            this.loading[i] = true
            setTimeout(() => (this.loading[i] = false), 3000)
        },
        newsletter() {
            //console.log('CIN:', this.email);

        },

        async fetchData() {
            try {
                const response = await axios.get('https://api.srtk.com.tn/api/settingsclient');
                const { success, message, setting } = response.data;

                if (success) {
                    const translation = setting.translations.find(t => t.locale === this.$i18n.locale);

                    if (translation) {
                        this.num_telstef = setting.num_tel_s;
                        this.mailstef = setting.email;
                        this.fcb = setting.facebook
                        this.tweet = setting.twitter
                        this.ytb = setting.youtube
                        this.namestef = translation.raison_sociale;
                        this.adr_stef = translation.adresse;
                    } else {
                        console.error('Translation not found for the selected locale');
                    }
                } else {
                    console.error(message);
                }
            } catch (error) {
                console.error(error);
            }
        },
    },
    mounted() {
        this.fetchData();
    }
}
</script>

<style lang="scss" scoped>
.input-footer {
    background-color: #fff;
    margin: 6px 0;
    width: 60%;
    height: 38px !important;
    padding: 0% 43% 0% 3%;
    border-bottom-left-radius: 22px;
    border-top-left-radius: 22px;
    float: left;
}

.btn-footer {
    border-top-right-radius: 22px !important;
    border-bottom-right-radius: 22px !important;
    height: 38px;
    width: 30%;
    float: left;
    margin-top: 5px;
    padding: 0% 4% 0% 3% !important;
    background-color: black !important;
    color: white !important
}

.soc-foot {
    background: linear-gradient(to bottom, #3182ce, #3182ce) !important;
    border-bottom: 2px solid white
}

footer {
    margin-top: 12px !important;
    background: linear-gradient(to top, #0053a0, #3182ce) !important;
}

.custom-text-field {
    height: 50px !important;
}

.bg-copyright {
    background-color: #0f64b3 !important
}

h2 {
    color: #000;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 25px;
    line-height: 1;
}

.social-icon {
    cursor: pointer;
    transition: all .3s ease-in-out;
    color: white !important;
}

.social-icon.fb {
    &:hover {
        color: #385898 !important
    }
}

.social-icon.yt {
    &:hover {
        color: #CC0000 !important
    }
}

.social-icon.tw {
    &:hover {
        color: #1D9BF0 !important
    }
}

.bus-img-newsletter {
    position: absolute;
    right: 25px;
    top: -20px;
    max-width: 270px;
    animation: img-scale 5s infinite linear;
}

@-webkit-keyframes img-scale {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    50% {
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
    }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@keyframes img-scale {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    50% {
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
    }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

.title-footer {
    position: relative;
    font-size: 15px;
    text-transform: uppercase;
    font-weight: 600;
    color: #fff;
    margin-bottom: 10px;
    position: relative;
    padding-left: 10px;
}

.title-footer::before {

    position: absolute;
    content: "";
    background: #fff;
    width: 3px;
    height: 100%;
    left: 0;
    top: 2px;

}

.list-footer::before {
    position: absolute;
    content: "";
    width: 0;
    height: 2px;
    top: 10px;
    left: 0;
    background: #37474f;
    -webkit-transition: 0.5s;
    transition: 0.5s;


}

.list-footer {
    transition: padding .5s ease-in-out;
    position: relative;
    color: #fff;

    &:hover {
        padding-left: 15px;
        color: #37474f;
        cursor: pointer;
    }
}

.list-footer:hover::before {
    width: 10px;
}

.bg-footer {}

.bt {
    border-radius: 30px;
    font-weight: 600;
    text-transform: capitalize;
    padding: 2px 10px;
}
</style>