<template>
    <v-footer class="bg-footer d-flex flex-column mt-4" style="padding:0;padding-top:10px;">


        <v-row class="p-4 w-100">

            <v-col cols="12" md="3">
                <v-col cols="12" class=" d-flex justify-content-center">
                    <img width="250" style="margin: 0 auto" src="/images/logo55_white.png">

                </v-col>
                <v-col cols="12" style="color:white !important;" class=" d-flex justify-center mb-6 ">
                    La société régionale de transport de Kasserine a été créée en 1962 pour le transport ...

                </v-col>

            </v-col>
            <v-col cols="12" md="6">
                <v-row>
                    <v-col cols="5" class="pl-12 ">
                        <h2 class="title-footer">Liens</h2>
                        <ul>

                            <li class="list-footer">Acceuil</li>
                            <li class="list-footer">Présentation</li>
                            <li class="list-footer">Actualités</li>
                            <li class="list-footer">Evennements</li>
                            <li class="list-footer">Activités</li>
                            <li class="list-footer">Contact</li>
                        </ul>
                    </v-col>
                    <v-col cols="7">
                        <h2 class="title-footer">Services</h2>
                        <ul>
                            <li class="list-footer">Abonnement urbain scolaire</li>
                            <li class="list-footer">Abonnement urbain ordinaire</li>
                            <li class="list-footer">Abonnement régional Scolaire</li>
                            <li class="list-footer">Abonnement régional ordinaire</li>
                            <li class="list-footer">Réservation</li>
                            <li class="list-footer">Horaires</li>
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

                                <v-btn class="justify-start bt" color="#fff" :loading="loading[1]" :disabled="loading[1]"
                                    @click="load(1)">S'inscrire</v-btn>
                            </v-form>

                            <v-icon class="m-2 social-icon fb" color="white" size="x-large" icon="mdi-facebook"></v-icon>
                            <v-icon class="m-2 social-icon yt" color="white" size="x-large" icon="mdi-youtube"></v-icon>
                            <v-icon class="m-2 social-icon tw" color="white" size="x-large" icon="mdi-twitter"></v-icon>


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
export default {
    data() {
        return {
            loading: [],
            email: '',
        }
    },
    methods: {
        load(i) {
            this.loading[i] = true
            setTimeout(() => (this.loading[i] = false), 3000)
        },
        newsletter() {
            //console.log('CIN:', this.email);

        }
    },
}
</script>

<style lang="scss" scoped>
.input-footer {
    background-color: #fff;
    width: 100%;
    margin: 5px 0;
    padding: 5px 10px;
    border-radius: 10px;
}

footer {
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

.bg-footer {
    box-shadow: 0px -3px 20px -7px;
}

.bt {
    border-radius: 30px;
    font-weight: 600;
    text-transform: capitalize;
    padding: 2px 10px;
}
</style>