<template>
    <v-banner lines="one" color="deep-purple-accent-4" class="p-banner">
            <div class="d-flex flex-column fill-height justify-center align-center text-white">
                <v-banner-text class="pl-10 pt-12 mt-2">
                    <v-row>
                        <v-col class="text-h4 pl-5" id="title">{{$pagename}}</v-col>

                    </v-row>
                    <NavLinkBread />
                </v-banner-text>
            </div>



    </v-banner>
</template>

<script>
export default {
    
    
    }

    
</script>

<style lang="scss" scoped>
.p-banner {
    padding-inline-start: 0 !important;
    padding-inline-end: 0 !important;
    padding-top: 0;
    padding-bottom: 0;
    background-image:url('/images/banner_srtk.jpg');
    height:200px;
    background-size: cover;
    background-position: center;
}

</style>