<template>
    <div class=" align-center c-menu-navbar  d-none d-md-flex top-header" :class="{ 'fixed-header': isFixed }">
        <div class="align-center  yes  d-none d-md-flex">
            <NuxtLink :to="localePath('/')"><v-btn :rounded="0" variant="plain" class="btn-nav">{{ $t('menu.accueil')
            }}</v-btn></NuxtLink>

            <v-btn :rounded="0" variant="plain" class="btn-nav">
                {{ $t('menu.srtk') }}
                <v-menu activator="parent" open-on-hover>
                    <v-list>

                        <NuxtLink :to="localePath(item.link)" v-for="(item, index) in srtk" :key="index" :value="index">
                            <v-list-item>
                                <v-list-item-title>
                                    {{ $t('menu.' + item.title) }}
                                </v-list-item-title>
                            </v-list-item>
                        </NuxtLink>

                    </v-list>
                </v-menu>
            </v-btn>

            <v-btn :rounded="0" variant="plain" class="btn-nav">
                {{ $t('menu.abn_urb') }}
                <v-menu activator="parent" open-on-hover>
                    <v-list>

                        <NuxtLink :to="localePath(item.link)" v-for="(item, index) in abonnementurb" :key="index"
                            :value="index">
                            <v-list-item>
                                <v-list-item-title>
                                    {{ $t('menu.' + item.title) }}
                                </v-list-item-title>
                            </v-list-item>
                        </NuxtLink>
                    </v-list>
                </v-menu>
            </v-btn>
            <v-btn :rounded="0" variant="plain" class="btn-nav">
                {{ $t('menu.abn_reg') }}
                <v-menu activator="parent" open-on-hover>
                    <v-list>

                        <NuxtLink :to="localePath(item.link)" v-for="(item, index) in abonnementreg" :key="index"
                            :value="index">
                            <v-list-item>
                                <v-list-item-title>
                                    {{ $t('menu.' + item.title) }}
                                </v-list-item-title>
                            </v-list-item>
                        </NuxtLink>
                    </v-list>
                </v-menu>
            </v-btn>
            <v-btn :rounded="0" variant="plain" class="btn-nav">
                {{ $t('menu.reservation') }}
                <v-menu activator="parent" open-on-hover>
                    <v-list>
                        <NuxtLink :to="localePath(item.link)" v-for="(item, index) in reservation" :key="index"
                            :value="index">
                            <v-list-item>
                                <v-list-item-title>
                                    {{ $t('menu.' + item.title) }}
                                </v-list-item-title>
                            </v-list-item>
                        </NuxtLink>

                    </v-list>
                </v-menu>
            </v-btn>
            <v-btn :rounded="0" variant="plain" class="btn-nav">
                {{ $t('menu.communication') }}
                <v-menu activator="parent" open-on-hover>
                    <v-list>
                        <NuxtLink :to="localePath(item.link)" v-for="(item, index) in communication" :key="index"
                            :value="index">
                            <v-list-item>
                                <v-list-item-title>
                                    {{ $t('menu.' + item.title) }}
                                </v-list-item-title>
                            </v-list-item>
                        </NuxtLink>
                    </v-list>
                </v-menu>
            </v-btn>
            <v-btn :rounded="0" variant="plain" class="btn-nav">
                {{ $t('menu.galerie') }}
                <v-menu activator="parent" open-on-hover>
                    <v-list>
                        <NuxtLink :to="localePath(item.link)" v-for="(item, index) in galerie" :key="index" :value="index">
                            <v-list-item>
                                <v-list-item-title>
                                    {{ $t('menu.' + item.title) }}
                                </v-list-item-title>
                            </v-list-item>
                        </NuxtLink>
                    </v-list>
                </v-menu>
            </v-btn>
            <v-btn :rounded="0" variant="plain" class="btn-nav">
                {{ $t('menu.about') }}
                <v-menu activator="parent" open-on-hover>
                    <v-list>
                        <NuxtLink :to="localePath(item.link)" v-for="(item, index) in apropos" :key="index" :value="index">
                            <v-list-item>
                                <v-list-item-title>
                                    {{ $t('menu.' + item.title) }}
                                </v-list-item-title>
                            </v-list-item>
                        </NuxtLink>
                    </v-list>
                </v-menu>
            </v-btn>

            <v-btn :rounded="0" variant="plain" class="btn-nav">
                <NuxtLink :to="localePath('/contact')">{{ $t('menu.contact') }}</NuxtLink>
            </v-btn>

        </div>
    </div>
</template>
   
<script>
import { useI18n } from 'vue-i18n'

export default {
    mounted() {
        this.isMobile = this.$vuetify.display.mobile
        window.addEventListener('scroll', this.handleScroll);
    },
    data: () => ({


        isFixed: false,

        isMobile: false,
        drawer: null,
        srtk: [
            { title: 'presentation', link: "presentation" },
            { title: 'qualite', link: "qualite" },
            { title: 'securite', link: "securite" },
        ],
        abonnementurb: [
            { title: 'abn_urb_scol', link: "urbain" },

        ],
        abonnementreg: [
            { title: 'abn_reg_scol', link: "regional_scolaire" },
        ],
        reservation: [
            { title: 'reserv_ticket', link: "reservation" },
            { title: 'horaire', link: "horaire" },
        ],
        communication: [
            { title: "acces_info", link: "accee-information" },
            { title: "app_offre", link: "appel-doffre" },
            { title: 'comm_media', link: "communication-media" },
        ],
        galerie: [
            { title: 'photos', link: "photos" },
            { title: 'videos', link: "videos" },
        ],
        apropos: [
            { title: 'actualite', link: "actualite" },
            { title: 'event', link: "evenement" },
            { title: 'recrutement', link: "recrutement" },
        ],

    }),
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {

        handleScroll() {
            if (window.pageYOffset > 100) {
                this.isFixed = true;
            } else {
                this.isFixed = false;
            }

        },

    }
}
</script>
   
<style lang="scss" scoped>
.v-btn--variant-plain {
    opacity: 1;
}

.fixed-header {
    position: fixed;
    top: 0;
    height: 45px !important;
    width: 100%;
    z-index: 999;
    background: linear-gradient(to top, #0053a0, #0000fe) !important;

    button {
        color: #ffffff;
        padding-top: 20px !important;
        padding-bottom: 26px;
        font-weight: 600;
        font-size: 13px;
        text-transform: capitalize;
        margin: 0 10px;

        &:hover {
            border-bottom: 4px solid #E3F2FD !important;

            //color: black;

        }
    }
}

.btn-lang {
    cursor: pointer;
}

.c-menu-navbar {
    height: 35px;
    justify-content: center;
    background-color: #ffffff;
    border-bottom: 6px solid #0053a0;

    .yes {
        background: linear-gradient(to top, #0053a0, #0000fe) !important;

        border-top-left-radius: 5px;
        border-top-right-radius: 8px;
    }

    button {
        color: #ffffff;
        padding-top: 10px;
        padding-bottom: 26px;
        font-weight: 600;
        font-size: 13px;
        text-transform: capitalize;
        margin: 0 10px;

        &:hover {
            border-bottom: 4px solid #E3F2FD !important;

            //color: black;

        }
    }


}

.btn-nav {
    &:hover {
        color: #ffffff !important;
    }

    display: block;
}

.v-list {
    width: 250px;

    a {
        .v-list-item-title {
            font-weight: 600;
            font-size: 13px;
            text-transform: capitalize;
        }

        .v-list-item-title::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #000;
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }

        .v-list-item-title:hover::after {
            transform: scaleX(1);
        }
    }

}
</style>