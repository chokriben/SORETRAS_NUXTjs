<template>
  <v-container dir="rtl">
    <v-row>
      <v-col>

        <v-card class="card-shadow" :class="typabon === 'eleve' ? 'eleve' : 'non-eleve'">
          <v-card-title class="text-center" style="font-size: 17px">
            Demande d'obtenir d'abonnement scolaire transport urbain
          </v-card-title>
          <v-card-subtitle class="text-center">Année scolaire : {{ currentYear }}-{{
            currentYear + 1
          }}</v-card-subtitle>
          <v-card-title style="font-weight: 600; font-size: 14px">
          </v-card-title>
          <v-responsive>
            <v-radio-group v-model="typabon">
              <v-row>

                <v-col cols="6" sm="3">
                  <v-radio label="Etudiant" value="etudiant"></v-radio>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-radio label="Stagiaire" value="stagiaire"></v-radio>
                </v-col>

              </v-row>
            </v-radio-group>
          </v-responsive>
          <!---selon type d'abonnement -->

          <v-card v-if="typabon === 'eleve'" class="icon-ics">
            <span class="mdi mdi-account ico"></span>
            <v-card-title style="margin-top: -20px">Espace Parent</v-card-title>
            <v-card-subtitle>Inscription</v-card-subtitle>
            <v-form @submit.prevent="loginp" class="m-3">
              <VSnackbar v-model="showSnackbar" :timeout="3000" color="error">
                {{ snackbarMessage }}
              </VSnackbar>
              <v-text-field prepend-inner-icon="mdi-card-account-details-outline" v-model="cin" label="CIN" required>
              </v-text-field>
              <v-text-field prepend-inner-icon="mdi-lock-outline" v-model="password" label="Mot de passe" type="password"
                required></v-text-field>

              <v-btn type="submit" color="#1414ff" class="bt-ics font-weight-bold ml-auto m-3 login text-body-2">Se
                connecter</v-btn>

              <router-link to="/inscription1">
                <v-btn class="ml-auto m-3 text-body-2 font-weight-bold">
                  S'inscrire</v-btn>
              </router-link>
            </v-form>
          </v-card>

          <!---إذا كان نوع الاشتراك طالب-->

          <v-card v-if="typabon === 'etudiant'">
            <v-card-text> </v-card-text>
          </v-card>

          <!---إذا كان نوع الاشتراك طالب غير مسجل!-->

          <v-card v-if="typetud === 'non-inscrit' && typabon == 'etudiant'">
            <v-form>
              <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
                {{ snackbar.message }}
              </v-snackbar>
              <v-card-text>
                <v-radio-group v-model="typeetudfac">
                  <v-row>
                    <v-col cols="12" sm="4">
                      كلية <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="4">
                      <v-radio label="عام" value="facpublic"></v-radio>
                    </v-col>
                    <v-col cols="6" sm="4">
                      <v-radio label="خاص" value="facpriv"></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-card-text>
              <v-row v-if="typetud === 'non-inscrit' &&
                typabon === 'etudiant' &&
                typeetudfac === 'facpublic'
                " class="form">
                <v-col cols="12" sm="6">
                  <select v-model="selected" class="forms">
                    <option value="null" selected>
                      Sélectionnez un établissement
                    </option>
                    <option v-for="etablissement in filteredEtablissements" :key="etablissement.id"
                      :value="etablissement.id">
                      {{ etablissement.translations[0].labelle }}
                    </option>

                  </select>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="classe" color="primary" label="الصف"
                    prepend-inner-icon="mdi-school"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="prenom" color="primary" label="الاسم واللقب"
                    prepend-inner-icon="mdi-account"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">

                  <ImageUpload @uploaded="image = $event" />
                  <v-img :src="'https://api.srtk.com.tn/' + image" width="170"></v-img>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field v-model="profession" color="primary" label="المهنة" style="display: none"
                    prepend-inner-icon="mdi-account-tie"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_naissance" type="date" color="primary" label="تاريخ الميلاد"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field prepend-inner-icon="mdi-card-account-details-outline" v-model="cin" :rules="[cinRule1]"
                    :error-messages="cinErrorsetud" color="primary" label="رقم بطاقة الهوية الوطنية"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_emission" type="date" color="primary"
                    label="تاريخ استلام بطاقة الهوية الوطنية" prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="nom_parent" color="primary" label="اسم ولقب الأبوين"
                    prepend-inner-icon="mdi-account-tie"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="adresse" color="primary" label="العنوان"
                    prepend-inner-icon="mdi-map-marker"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field type="email" v-model="email" color="primary" label="البريد الإلكتروني"
                    prepend-inner-icon="mdi-at"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="num_telephone" color="primary" label="الهاتف"
                    prepend-inner-icon="mdi-phone"></v-text-field>
                </v-col>
                <v-card-text style="width: 100%">
                  <v-radio-group v-model="semestre">
                    <v-row>
                      <v-col cols="12" sm="3">
                        Période <span style="color: red">*</span>
                        <span class="mdi mdi-play"></span>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Semestre 1" value="sem1"></v-radio>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Semestre 2" value="sem2"></v-radio>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Annuel" value="an"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-card-text>

                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      Région <span style="color: red">*</span>
                      <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <select v-model="selectedGareId" class="forms" autocomplete>
                        <option value="null">Sélectionnez une région</option>
                        <option v-for="gare in garess" :key="gare.id" :value="gare.id">
                          {{ gare.name }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      Ligne <span class="mdi mdi-play"></span>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <select v-model="select_line" class="forms" @change="fetchAbonnesPrix(select_line)">
                        <option value="">Sélectionnez une ligne</option>
                        <option v-for="ligne in lignes" :key="ligne.id" :value="ligne.id">
                          {{
                            ligne.station_name +
                            " - " +
                            ligne.fin_station_name +
                            " - " +
                            ligne.cod
                          }}
                        </option>
                      </select>

                    </v-col>
                  </v-row>
                </v-card-text>

                <div>
                  <v-btn @click="handleRegistration" class="bt-ics">سجّل</v-btn>
                </div>
              </v-row>
              <!---غير مسجل طالب خاص !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-->

              <v-row v-if="typetud === 'non-inscrit' &&
                typabon === 'etudiant' &&
                typeetudfac === 'facpriv'
                " class="form">
                <v-col cols="12" sm="6">
                  <select v-model="selected" class="forms">
                    <option value="null" selected>
                      Sélectionnez un établissement
                    </option>
                    <option v-for="etablissement in filteredEtablissements" :key="etablissement.id"
                      :value="etablissement.id">
                      {{ etablissement.translations[0].labelle }}
                    </option>
                  </select>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="classe" color="primary" label="الصف"
                    prepend-inner-icon="mdi-school"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="prenom" color="primary" label="الاسم واللقب"
                    prepend-inner-icon="mdi-school"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">

                  <ImageUpload @uploaded="image = $event" />
                  <v-img :src="'https://api.srtk.com.tn/' + image" width="170"></v-img>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_naissance" type="date" color="primary" label="تاريخ الميلاد"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field prepend-inner-icon="mdi-card-account-details-outline" v-model="cin" :rules="[cinRule1]"
                    :error-messages="cinErrorsetud" color="primary" label="رقم بطاقة الهوية الوطنية"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_emission" type="date" color="primary"
                    label="تاريخ استلام بطاقة الهوية الوطنية" prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="nom_parent" color="primary" label="اسم ولقب الأبوين"
                    prepend-inner-icon="mdi-account-tie"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="adresse" color="primary" label="العنوان"
                    prepend-inner-icon="mdi-map-marker"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field type="email" v-model="email" color="primary" label="البريد الإلكتروني"
                    prepend-inner-icon="mdi-at"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="num_telephone" color="primary" label="الهاتف"
                    prepend-inner-icon="mdi-phone"></v-text-field>
                </v-col>


                <v-card-text style="width: 100%">
                  <v-radio-group v-model="semestre">
                    <v-row>
                      <v-col cols="12" sm="3">
                        الفترة <span style="color: red">*</span>
                        <span class="mdi mdi-play"></span>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Semestre 1" value="sem1"></v-radio>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Semestre 2" value="sem2"></v-radio>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Annuel" value="an"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-card-text>

                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      Région <span style="color: red">*</span>
                      <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <select v-model="selectedGareId" class="forms" autocomplete>
                        <option value="null">Sélectionnez une région</option>
                        <option v-for="gare in garess" :key="gare.id" :value="gare.id">
                          {{ gare.name }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      Ligne <span class="mdi mdi-play"></span>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <select v-model="select_line" class="forms" @change="fetchAbonnesPrix(select_line)">
                        <option value="">Sélectionnez une ligne</option>
                        <option v-for="ligne in lignes" :key="ligne.id" :value="ligne.id">
                          {{
                            ligne.station_name +
                            " - " +
                            ligne.fin_station_name +
                            " - " +
                            ligne.cod
                          }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>

                <div>
                  <v-btn @click="handleRegistration" class="bt-ics">سجّل</v-btn>
                </div>

              </v-row>
            </v-form>
          </v-card>

          <v-card v-if="typabon === 'stagiaire'">
            <v-form>
              <VSnackbar v-model="showSnackbar" :timeout="3000" color="error">
                {{ snackbarMessage }}
              </VSnackbar>
              <v-card-text>
                <v-radio-group v-model="typeecol">
                  <v-row>
                    <v-col cols="12" sm="4">
                      نوع المدرسة <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="4">
                      <v-radio label="عمومية" value="ecolpublic"></v-radio>
                    </v-col>
                    <v-col cols="6" sm="4">
                      <v-radio label="خاصة" value="ecolpriv"></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-card-text>
              <!-- publiccccccccccccccccccccccccc stagaireeeeeee !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-->
              <v-row v-if="typeecol === 'ecolpublic' && typabon === 'stagiaire'" class="form">
                <v-col cols="12" sm="6">
                  <select v-model="selected" class="forms">
                    <option value="null" selected>
                      Sélectionnez un établissement
                    </option>
                    <option v-for="etablissement in filteredEtablissements" :key="etablissement.id"
                      :value="etablissement.id">
                      {{ etablissement.translations[0].labelle }}
                    </option>
                  </select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_debut" type="date" color="primary" label="تاريخ بداية التدريب"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_fin" type="date" color="primary" label="تاريخ نهاية التدريب"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="classe" color="primary" label="الصف"
                    prepend-inner-icon="mdi-school"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="prenom" color="primary" label="الاسم واللقب"
                    prepend-inner-icon="mdi-account"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">

                  <ImageUpload @uploaded="image = $event" />
                  <v-img :src="'https://api.srtk.com.tn/' + image" width="170"></v-img>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="adresse" color="primary" label="العنوان"
                    prepend-inner-icon="mdi-map-marker"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_naissance" type="date" color="primary" label="تاريخ الميلاد"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field prepend-inner-icon="mdi-card-account-details-outline" v-model="cin" :rules="[cinRule1]"
                    :error-messages="cinErrorsetud" color="primary" label="رقم بطاقة الهوية الوطنية"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_emission" type="date" color="primary"
                    label="تاريخ استلام بطاقة الهوية الوطنية" prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="nom_parent" color="primary" label="اسم ولقب الأبوين"
                    prepend-inner-icon="mdi-account-tie"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field type="email" v-model="email" color="primary" label="البريد الإلكتروني"
                    prepend-inner-icon="mdi-at"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="num_telephone" color="primary" label="الهاتف"
                    prepend-inner-icon="mdi-phone"></v-text-field>
                </v-col>
                <v-card-text style="width: 100%">
                  <v-radio-group v-model="semestre">
                    <v-row>
                      <v-col cols="12" sm="4">
                        الفترة <span class="mdi mdi-play"></span>
                      </v-col>
                      <v-col cols="6" sm="4">
                        <v-radio label="الفصل الدراسي 1" value="sem1"></v-radio>
                      </v-col>
                      <v-col cols="6" sm="4">
                        <v-radio label="الفصل الدراسي 2" value="sem2"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-card-text>

                <v-card-text style="width: 100%">
                  <v-radio-group v-model="semestre">
                    <v-row>
                      <v-col cols="12" sm="3">
                        الفترة <span style="color: red">*</span>
                        <span class="mdi mdi-play"></span>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Semestre 1" value="sem1"></v-radio>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Semestre 2" value="sem2"></v-radio>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Annuel" value="an"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-card-text>

                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      Région <span style="color: red">*</span>
                      <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <select v-model="selectedGareId" class="forms" autocomplete>
                        <option value="null">Sélectionnez une région</option>
                        <option v-for="gare in garess" :key="gare.id" :value="gare.id">
                          {{ gare.name }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      Ligne <span class="mdi mdi-play"></span>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <select v-model="select_line" class="forms" @change="fetchAbonnesPrix(select_line)">
                        <option value="">Sélectionnez une ligne</option>
                        <option v-for="ligne in lignes" :key="ligne.id" :value="ligne.id">
                          {{
                            ligne.station_name +
                            " - " +
                            ligne.fin_station_name +
                            " - " +
                            ligne.cod
                          }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>


                <div>
                  <v-btn @click="handleRegistration" class="bt-ics">سجّل</v-btn>
                </div>

              </v-row>

              <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
                {{ snackbar.message }}
              </v-snackbar>

              <!-- stagaire priveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee -->
              <v-row v-if="typeecol === 'ecolpriv' && typabon === 'stagiaire'" class="form">
                <v-col cols="12" sm="6">
                  <select v-model="selected" class="forms">
                    <option value="null" selected>
                      Sélectionnez un établissement
                    </option>
                    <option v-for="etablissement in filteredEtablissements" :key="etablissement.id"
                      :value="etablissement.id">
                      {{ etablissement.translations[0].labelle }}
                    </option>
                  </select>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="classe" color="primary" label="الصف"
                    prepend-inner-icon="mdi-school"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="prenom" color="primary" label="الاسم واللقب"
                    prepend-inner-icon="mdi-account"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">

                  <ImageUpload @uploaded="image = $event" />
                  <v-img :src="'https://api.srtk.com.tn/' + image" width="170"></v-img>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_naissance" type="date" color="primary" label="تاريخ الميلاد"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field prepend-inner-icon="mdi-card-account-details-outline" v-model="cin" :rules="[cinRule1]"
                    :error-messages="cinErrorsetud" color="primary" label="رقم بطاقة الهوية الوطنية"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_emission" type="date" color="primary"
                    label="تاريخ استلام بطاقة الهوية الوطنية" prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_debut" type="date" color="primary" label="تاريخ بداية التدريب"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_fin" type="date" color="primary" label="تاريخ نهاية التدريب"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="nom_parent" color="primary" label="اسم ولقب الأبوين"
                    prepend-inner-icon="mdi-account-tie"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="adresse" color="primary" label="العنوان"
                    prepend-inner-icon="mdi-map-marker"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field type="email" v-model="email" color="primary" label="البريد الإلكتروني"
                    prepend-inner-icon="mdi-at"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="num_telephone" color="primary" label="الهاتف"
                    prepend-inner-icon="mdi-phone"></v-text-field>
                </v-col>

                <v-card-text style="width: 100%">
                  <v-radio-group v-model="semestre">
                    <v-row>
                      <v-col cols="12" sm="3">
                        الفترة <span style="color: red">*</span>
                        <span class="mdi mdi-play"></span>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Semestre 1" value="sem1"></v-radio>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Semestre 2" value="sem2"></v-radio>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="Annuel" value="an"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-card-text>

                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      Région <span style="color: red">*</span>
                      <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <select v-model="selectedGareId" class="forms" autocomplete>
                        <option value="null">Sélectionnez une région</option>
                        <option v-for="gare in garess" :key="gare.id" :value="gare.id">
                          {{ gare.name }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      Ligne <span class="mdi mdi-play"></span>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <select v-model="select_line" class="forms" @change="fetchAbonnesPrix(select_line)">
                        <option value="">Sélectionnez une ligne</option>
                        <option v-for="ligne in lignes" :key="ligne.id" :value="ligne.id">
                          {{
                            ligne.station_name +
                            " - " +
                            ligne.fin_station_name +
                            " - " +
                            ligne.cod
                          }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>

                <div>
                  <v-btn @click="handleRegistration" class="bt-ics">سجّل</v-btn>
                </div>

              </v-row>
            </v-form>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import ImageUpload from "@/components/ImageUpload.vue"; // Ajustez le chemin vers votre composant

import { ref, onMounted, computed } from "vue";
import axios from "axios";



definePageMeta({
  layout: "p",
});


//chokriiiiiiiiiiiiiiiiiiiii
const csrf_token = ref(null);
const csrfToken = ref(null);
const type_abonne = ref("scolaire");
const image = ref("");

const garess = ref([]);
const selectedGareId = ref(null);
const price = ref(0);
const date_debut = ref("");
const date_fin = ref("");

const gare = ref("");
const typetudfac = ref(null);
const enabled = ref(false);
const typabon = ref(null);
const typetud = ref("non-inscrit");
const typeetudfac = ref(null);
const semestre = ref(null);
const ligne = ref(null);
const zone = ref("");
const montant = ref(0);
const typeecol = ref(null);
const selected = ref(null);
const select_line = ref("");
const etablissements = ref([]);
const gares = ref([]);
const lignes = ref([]);
const showSnackbar = ref(false);
const snackbarMessage = ref("");
const password = ref("");
const email = ref("");
const num_telephone = ref("");
const date_naissance = ref("");
const date_emission = ref("");
const cin = ref("");
const prenom = ref("");
const adresse = ref("");
const profession = ref("");

const classe = ref("");
const nom_parent = ref("");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const snackbar = ref({
  show: false,
  message: "",
  color: "",
});
const headers = {
  "Content-Type": "multipart/form-data",
  'CSRF-TOKEN': csrfToken.value, // Use csrfToken.value to access the ref value
};

const getToken = async () => {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/token");
    csrfToken.value = response.data.csrf_token; // Set the csrfToken
    headers.csrf_token = csrfToken.value; // Add the CSRF token to the headers
    //console.log(csrfToken.value)
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
  }
};










const idd = ref("");
async function fetchAbonnesPrix(id) {
  // Appel à l'API abonnesprix lorsque la sélection change
  if (id != "") {
    try {
      ////console.log(id);
      const response = await axios.get(
        "https://api.srtk.com.tn/api/ligne_station/" + id
      );
      idd.value = response.data.Lignes[0].ligne_id;
      ligne.value = idd.value;
      const response1 = await axios.get(
        "https://api.srtk.com.tn/api/lgine/show/" + idd.value
      );
      idd.value = response1.data.Ligne[0].cod;
      // Faites ici l'appel HTTP à l'API et traitez la réponse
      // Stockez les données de l'API dans abonnesPrixData
    } catch (error) {
      console.error("Error fetching gares:", error);
    }
    const v = idd.value % 1000;
    idd.value = idd.value - v;
    idd.value = idd.value / 1000;
    if (semestre.value === 'an') {
      idd.value = idd.value + 10;
    }


    try {
      const response = await axios.get(
        "https://api.srtk.com.tn/api/abonneprix/show/" + idd.value
      );
      const newPrice = 3 + parseFloat(response.data.tarif.prix);

      // Mettez à jour la valeur de la variable price
      price.value = newPrice;
      return (prix.value = response.data.tarif.prix);
      // Faites ici l'appel HTTP à l'API et traitez la réponse
      // Stockez les données de l'API dans abonnesPrixData
    } catch (error) {
      console.error("Error fetching gares:", error);
    }
  } else {
    return (prix.value = "");
  }
}




// Fetch gares
async function fetchgares() {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/gares");
    return (garess.value = response.data.Gares.data);
  } catch (error) {
    console.error("Error fetching gares:", error);
  }
}

// Fetch etablissements
async function fetchEtablissements() {
  try {
    const response = await axios.get(
      "https://api.srtk.com.tn/api/etablissements"
    );
    etablissements.value = response.data.etablissements;
    //console.log(etablissements.value)
  } catch (error) {
    console.error("Error fetching etablissements:", error);
  }
}
//fetch lignes

async function fetchLignes() {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/ligne_station");
    const data = response.data.Lignes; // Access the 'data' property within the 'Lignes' object
    lignes.value = data;
  } catch (error) {
    //console.error("Error fetching lignes:", error);
  }
}
const filteredEtablissements = computed(() => {
  if (typeetudfac.value === "facpublic") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Etatique_lycee"
    );
  } else if (typeetudfac.value === "facpriv") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Etatique_super"
    );
  } else {
    return [];
  }
});


async function fetchAbn() {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/abonnesprix");
    const data = response.data.abonnesPrix.data; // Access the 'data' property within the 'Lignes' object
    abn.value = data;
  } catch (error) {
    //console.error("Error fetching lignes:", error);
  }
}
//stagaire
const filteredEtablissementstag = computed(() => {
  if (typeecol.value === "ecolpublic") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Etatique_College"
    );
  } else if (typeecol.value === "ecolpriv") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Prive_Secondaire"
    );
  } else {
    return [];
  }
});
// Call fetchEtablissements on component mount
onMounted(() => {
  (async () => {
    await fetchgares();
    await fetchEtablissements();
    await fetchLignes();
    await fetchAbn();
  })();
});

const resetForm = () => {
  password.value = "";

  email.value = "";
  num_telephone.value = "";
  date_naissance.value = "";
  date_emission.value = "";
  cin.value = "";
  prenom.value = "";
  nom_parent.value = "";
  adresse.value = "";
  classe.value = "";
  selected.value = "";
  select_line.value = "";
  date_debut.value = "";
  date_fin.value = "";
  image.value = "";
};

const handleRegistration = async () => {

  const requiredFields = [
    cin.value,
    num_telephone.value,
    email.value,
    date_naissance.value,
    date_emission.value,
    prenom.value,
    nom_parent.value,
    adresse.value,
    classe.value,

  ];

  const isAllFieldsFilled = requiredFields.every((field) => !!field);

  if (!isAllFieldsFilled) {
    snackbar.value = {
      show: true,
      message: "Veuillez remplir tous les champs.",
      color: "error",
    };
    return; // Stop further execution
  }
  if (!cin.value || cin.value.length !== 8) {
    snackbar.value.message =
      "Le champ CIN doit contenir exactement 8 chiffres.";
    snackbar.value.color = "error";
    snackbar.value.show = true;
    return; // Stop form submission
  }

  if (num_telephone.value.length !== 8) {
    snackbar.value.message =
      "Le champ numero de telnum_telephone doit contenir exactement 8 chiffres.";
    snackbar.value.color = "error";
    snackbar.value.show = true;
    return; // Stop form submission
  }
  if (!emailRegex.test(email.value)) {
    snackbar.value = {
      show: true,
      message: "Email is not valid!",
      color: "error",
      position: "top",
    };

    resetForm();
    return;
  }
  //console.log(prix.value);

  let typeInscrit = typetudfac.value === "inscrit" ? "inscrit" : "non-inscrit";

  let typePeriode = semestre.value === "semestre 1" ? "semestre 1" : "semestre 2";

  let typeValidite = null;

  if (ligne.value === "un") {
    typeValidite = "un";
  } else if (ligne.value === "tout") {
    typeValidite = "tout";
  }

  let typeZone = null;
  if (zone.value === "un") {
    typeZone = "Zone A";
  } else if (zone.value === "tout") {
    typeZone = "Zone B";
  }

  let typeInstitut = null;

  if (typetud.value === "facpublic") {
    typeInstitut = "facpublic";
  } else if (typetud.value === "facpriv") {
    typeInstitut = "facpriv";
  }

  let typeEleve = null;

  if (typabon.value === "etudiant") {
    typeEleve = "etudiant";
  } else if (typabon.value === "stagiaire") {
    typeEleve = "stagiaire";
  }
  await getToken();
  headers['csrf_token'] = csrfToken.value;


  const etablissement = etablissements.value.find(
    (item) => item.labelle === selected.value
  );
  const x = lignes.value.find((item) => item.name === select_line.value);

  const payload = {
    csrf_token: csrfToken.value,

    date_debut: typeEleve === "stagiaire" ? date_debut.value : null,
    date_fin: typeEleve === "stagiaire" ? date_fin.value : null,
    email: email.value,
    cin: cin.value,
    num_telephone: num_telephone.value,
    date_naissance: date_naissance.value,
    date_emission: date_emission.value,
    prenom_fr: prenom.value,
    prenom_en: prenom.value,
    prenom_ar: prenom.value,
    nom_parent_fr: nom_parent.value,
    nom_parent_en: nom_parent.value,
    nom_parent_ar: nom_parent.value,
    adresse_fr: adresse.value,
    adresse_en: adresse.value,
    adresse_ar: adresse.value,
    classe_fr: classe.value,
    classe_en: classe.value,
    classe_ar: classe.value,
    type_paiment: "gg",
    profession_fr: "ww",
    profession_en: "ww",
    profession_ar: "ww",
    prix: "10",
    code: "10",
    unique_id: "10000000",
    ligne_id: ligne.value,
    Etablissement_id: selected.value,
    type_eleve: typeEleve,
    type_validite: typeValidite,
    type_zone: selectedGareId.value,
    type_inscrit: typeInscrit,
    type_periode: typePeriode,
    type_institut: typeInstitut,
    type_eleve: "etudiant",
    etat: "En cours",
    image: image.value,

  };

  try {


    await axios.post("https://api.srtk.com.tn/api/abonne/add", payload, { headers: headers });
    snackbar.value = {
      show: true,
      message: "Registration successful!",
      color: "success",
    };
    resetForm();
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // Uniqueness validation error
      snackbar.value = {
        show: true,
        message: "Le CIN existe déjà!",
        color: "error",
      };
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      snackbar.value = {
        show: true,
        message: error.response.data.message,
        color: "error",
      };
    } else if (error.response && error.response.data) {
      // Display the error message from the response
      snackbar.value = {
        show: true,
        message: error.response.data.message,
        color: "error",
      };
    } else {
      snackbar.value = {
        show: true,
        message: "Erreur lors de l'insertion des données.",
        color: "error",
      };
    }
    console.error("Registration failed:", error);
  }
};

const currentYear = ref(new Date().getFullYear());
const token = useCookie("token");
const toggleVisibility = () => {
  const vCard = document.getElementById("v-card");
  if (vCard) {
    vCard.style.display = enabled.value ? "block" : "none";
  }
};

</script>

<style>
.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  /* Add any margin as needed */
}

td {
  padding: 0 10px !important;
}

.login {
  color: white;
}

.v-label {
  font-size: 14px;
}

.check {
  text-transform: capitalize;
}

.bt-ics {
  font-size: 14px !important;
  text-transform: capitalize;
  background: linear-gradient(to top, #0053a0, #3182ce) !important;
  color: white;
}

.bt-ics:hover {
  background: linear-gradient(to bottom, #0053a0, #4aa2f5) !important;
  color: white;
}

.montant {
  color: red;
}

.form {
  padding: 20px;
}

.card-shadow {
  padding: 30px;
}

.card-shadow:hover {
  box-shadow: 0px 0px 7px 0px;
}

.eleve {
  background: linear-gradient(to top, #07447e, #2793f8);
  color: white;
}

.non-eleve {
  background-color: white;
}

.icon-ics {
  text-align: center;
  width: 40%;
  margin: 0 auto;
  padding-top: 10px;
  margin-top: 30px;
  background-color: rgba(255, 255, 255, 0.836);
  color: rgb(27, 27, 27);
  box-shadow: 0px 0px 20px 3px;
}

.ico {
  font-size: 70px;
  margin-bottom: 3px;
  color: rgb(129, 129, 129);
}

.icon-ics:hover {
  /* .ico{
            color:#0053a0;
        } */
}
</style>