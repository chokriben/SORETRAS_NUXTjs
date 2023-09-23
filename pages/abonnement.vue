<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card v-if="!enabled">
          <v-card-title class="text-center">
            Demande d'obtenir d'abonnement scolaire de transport urbain
            <p style="color:red"> Veuillez saisir les données en arabe <br>
              الرجاء إدخال البيانات باللغة العربية
            </p>
          </v-card-title>
          <v-card-subtitle class="text-center">
            Année scolaire :{{ currentYear }}-{{
              currentYear + 1
            }}
            :</v-card-subtitle>
          <v-card-title class="text-center">
            Politique de protection des données personnelles
          </v-card-title>
          <v-card-text>
            Conformément aux dispositions de la loi organique n° 2004-63 du 27
            juillet 2004 modifiée suite à l'adhésion de la République tunisienne
            au traité n° 108 du Conseil de l'Europe par la loi organique n°
            2017-42 du 30 mai 2017, le Kasserine La Société Régionale de
            Transport informe les personnes concernées de ce qui suit :
          </v-card-text>
          <v-list>
            <v-list-item><span class="mdi mdi-menu-right"></span> Le responsable du
              traitement des données personnelles est la Société Régionale de
              Transport de Kasserine
            </v-list-item>
            <v-list-item><span class="mdi mdi-menu-right"></span>Les données personnelles
              seront collectées sur le site aux fins d'inscrire la personne
              concernée dans le système d'abonnement numérique et de vérifier
              son respect des conditions pour bénéficier d'un abonnement de
              transport à bord des bus de la société et d'organiser son
              fonctionnement.
            </v-list-item>
          </v-list>

          <v-card-text>
            <table>
              <tbody>
                <tr>
                  <td>
                    <v-subtitle class="mt-3 check" v-if="!enabled">
                      J'ai lu et j'accepte
                    </v-subtitle>
                  </td>
                  <td>
                    <v-checkbox-btn v-model="enabled" @change="toggleVisibility" class="pe-0"></v-checkbox-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-card>
        <v-card class="card-shadow" v-if="enabled" :class="typabon === 'eleve' ? 'eleve' : 'non-eleve'">
          <v-card-title class="text-center" style="font-size: 17px">
            Demande d'obtenir d'abonnement scolaire transport urbain
            <p style="color:red"> Veuillez saisir les données en arabe <br>
              الرجاء إدخال البيانات باللغة العربية
            </p>
          </v-card-title>
          <v-card-subtitle class="text-center">العام الدراسي : {{ currentYear }}-{{
            currentYear + 1
          }}</v-card-subtitle>
          <v-card-title style="font-weight: 600; font-size: 14px">
          </v-card-title>
          <v-responsive>
            <v-radio-group v-model="typabon">
              <v-row>
                <v-col cols="6" sm="3">
                  <v-radio label="التلميذ" value="eleve" @click="showFamilleComponent = false"></v-radio>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-radio label="طالب" value="etudiant" @click="showFamilleComponent = false"></v-radio>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-radio label="المتدرب" value="stagiaire" @click="showFamilleComponent = false"></v-radio>
                </v-col>
                <v-col cols="6" sm="3">
                  <router-link to="/familleComponent">
                    <v-btn class="ml-auto m-3 text-body-2 font-weight-bold"
                      style="color:white;background-color:rgb(39, 145, 201);">
                      تلميذ أو طالب معني بالشؤون الإجتماعية</v-btn>
                  </router-link>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-responsive>
          <!---selon type d'abonnement
          <v-card v-if="showFamilleComponent">
            <familleComponent></familleComponent>

          </v-card> -->
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

              <router-link to="/inscription">
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
                      اختر الكلية
                    </option>
                    <option v-for="etablissement in filteredEtablissements" :value="etablissement.id">
                      {{ etablissement.translations[0].labelle }}
                    </option>
                  </select>
                </v-col>

                <v-col cols="12" sm="6">


                  <select v-model="classe" class="forms" autocomplete>
                    <option value="">الصف</option>
                    <option value="السنة الأولى">السنة الأولى</option>
                    <option value="السنة الثانية">السنة الثانية</option>
                    <option value="السنة الثالثة">السنة الثالثة</option>
                    <option value="السنة الأولى ماجستير"> السنة الأولى ماجستير</option>
                    <option value="السنة الثانية ماجستير"> السنة الثانية ماجستير</option>

                  </select>

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
                  <v-text-field v-model="nom_parent" color="primary" label="اسم ولقب الأب"
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
                        <v-radio label="سداسي" value="sem1"></v-radio>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="سنوي" value="an"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-card-text>

                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      المنطقة <span style="color: red">*</span>
                      <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <select v-model="selectedGareId" class="forms" autocomplete
                        @change="fetchAbonnesligne(selectedGareId)">
                        <option value="null">اختر منطقة</option>
                        <option v-for="gare in garess" :value="gare.id">
                          {{ gare.name }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      الخط <span class="mdi mdi-play"></span>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <select v-model="select_line" class="forms" @change="fetchAbonnesPrix(select_line)">
                        <option value="">اختر الخط</option>
                        <option v-for="ligne in lignes" :value="ligne.id">
                          {{
                            ligne.station_name + " - " + ligne.fin_station_name

                          }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-col cols="12" sm="12" class="montant" v-if="prix != 0">
                  {{ typ_yes }}<br />
                  السعر: {{ prix }} دينار<br />
                  + 3 دينار لمعالجة طلبات التسجيل عبر الإنترنت
                </v-col>
                <v-col cols="12" sm="12">
                  <div>
                    <div v-if="!paymentSessionId">
                      <v-btn @click="handleRegistration" class="bt-ics">سجّل</v-btn>
                    </div>

                    <!-- Payment Section -->
                    <div v-else>
                      <div class="btn-container">
                        <v-btn color="primary" @click="redirectToPaymentPage">انتقل إلى خطوة الدفع</v-btn>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <!---غير مسجل طالب خاص !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-->

              <v-row v-if="typetud === 'non-inscrit' &&
                typabon === 'etudiant' &&
                typeetudfac === 'facpriv'
                " class="form">
                <v-col cols="12" sm="6">
                  <select v-model="selected" class="forms">
                    <option value="null" selected>
                      اختر الكلية
                    </option>
                    <option v-for="etablissement in filteredEtablissements" :value="etablissement.id">
                      {{ etablissement.translations[0].labelle }}
                    </option>
                  </select>
                </v-col>

                <v-col cols="12" sm="6">
                  <select v-model="classe" class="forms" autocomplete>
                    <option value="">الصف</option>
                    <option value="السنة الأولى">السنة الأولى</option>
                    <option value="السنة الثانية">السنة الثانية</option>
                    <option value="السنى الثالثة">السنى الثالثة</option>
                    <option value="السنة الأولى ماجستير"> السنة الأولى ماجستير</option>
                    <option value="السنة الثانية ماجستير"> السنة الثانية ماجستير</option>

                  </select>
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
                        <v-radio label="سداسي 1" value="sem1"></v-radio>
                      </v-col>

                      <v-col cols="6" sm="3">
                        <v-radio label="سنوي" value="an"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-card-text>

                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      المنطقة <span style="color: red">*</span>
                      <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <select v-model="selectedGareId" class="forms" autocomplete
                        @change="fetchAbonnesligne(selectedGareId)">
                        <option value="null">اختر منطقة</option>
                        <option v-for="gare in garess" :value="gare.id">
                          {{ gare.name }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      الخط <span class="mdi mdi-play"></span>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <select v-model="select_line" class="forms" @change="fetchAbonnesPrix(select_line)">
                        <option value="">اختر الخط</option>
                        <option v-for="ligne in lignes" :value="ligne.id">
                          {{
                            ligne.station_name +
                            " - " +
                            ligne.fin_station_name

                          }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-col cols="12" sm="12" class="montant" v-if="prix != 0">
                  {{ typ_yes }}<br />
                  السعر: {{ prix }} دينار<br />
                  + 3 دينار لمعالجة طلبات التسجيل عبر الإنترنت
                </v-col>
                <v-col cols="12" sm="12">
                  <div>
                    <div v-if="!paymentSessionId">
                      <v-btn @click="handleRegistration" class="bt-ics">سجّل</v-btn>
                    </div>

                    <!-- Payment Section -->
                    <div v-else>
                      <div class="btn-container">
                        <v-btn color="primary" @click="redirectToPaymentPage">انتقل إلى خطوة الدفع</v-btn>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-card>

          <v-card v-if="typabon === 'stagiaire'">
            <v-form>
              <VSnackbar v-model="showSnackbar" :timeout="3000" color="error">
                {{ snackbarMessage }}
              </VSnackbar>
              <v-card-text>
                <v-radio-group v-model="typform">
                  <v-row>
                    <v-col cols="12" sm="3">
                      نوع التربص <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="3">
                      <v-radio label="المستوى الأول" value="cop"></v-radio>
                    </v-col>
                    <v-col cols="6" sm="3">
                      <v-radio label="المستوى الفني" value="btp"></v-radio>
                    </v-col>
                    <v-col cols="6" sm="3">
                      <v-radio label="مستوى المؤهل تقني سامي" value="bts"></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-card-text>
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
                      اختر المنشأة
                    </option>
                    <option v-for="etablissement in filteredEtablissementstag" :value="etablissement.id">
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
                  <v-text-field v-model="date_debut" type="date" color="primary" label="تاريخ بداية التدريب"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_fin" type="date" color="primary" label="تاريخ نهاية التدريب"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
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
                      <v-col cols="12" sm="3">
                        الفترة <span style="color: red">*</span>
                        <span class="mdi mdi-play"></span>
                      </v-col>
                      <v-col cols="6" sm="3">
                        <v-radio label="سداسي" value="sem1"></v-radio>
                      </v-col>

                      <v-col cols="6" sm="3">
                        <v-radio label="سنوي" value="an"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-card-text>

                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      المنطقة <span style="color: red">*</span>
                      <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <select v-model="selectedGareId" class="forms" autocomplete
                        @change="fetchAbonnesligne(selectedGareId)">
                        <option value="null">اختر منطقة</option>
                        <option v-for="gare in garess" :value="gare.id">
                          {{ gare.name }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      الخط <span class="mdi mdi-play"></span>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <select v-model="select_line" class="forms" @change="fetchAbonnesPrix(select_line)">
                        <option value="">اختر الخط</option>
                        <option v-for="ligne in lignes" :value="ligne.id">
                          {{
                            ligne.station_name +
                            " - " +
                            ligne.fin_station_name
                          }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-col cols="12" sm="12" class="montant" v-if="prix != 0">
                  {{ typ_yes }}<br />
                  السعر: {{ prix }} دينار<br />
                  + 3 دينار لمعالجة طلبات التسجيل عبر الإنترنت
                </v-col>
                <v-col cols="12" sm="12">
                  <div>
                    <div v-if="!paymentSessionId">
                      <v-btn @click="handleRegistration" class="bt-ics">سجّل</v-btn>
                    </div>

                    <!-- Payment Section -->
                    <div v-else>
                      <div class="btn-container">
                        <v-btn color="primary" @click="redirectToPaymentPage">انتقل إلى خطوة الدفع</v-btn>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
                {{ snackbar.message }}
              </v-snackbar>

              <!-- stagaire priveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee -->
              <v-row v-if="typeecol === 'ecolpriv' && typabon === 'stagiaire'" class="form">
                <v-col cols="12" sm="6">
                  <select v-model="selected" class="forms">
                    <option value="null" selected>
                      اختر المنشأة
                    </option>
                    <option v-for="etablissement in filteredEtablissementstag" :value="etablissement.id">
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
                        <v-radio label="سداسي" value="sem1"></v-radio>
                      </v-col>

                      <v-col cols="6" sm="3">
                        <v-radio label="سنوي" value="an"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-card-text>

                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      المنطقة <span style="color: red">*</span>
                      <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <select v-model="selectedGareId" class="forms" autocomplete
                        @change="fetchAbonnesligne(selectedGareId)">
                        <option value="null">اختر منطقة</option>
                        <option v-for="gare in garess" :value="gare.id">
                          {{ gare.name }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text style="width: 100%">
                  <v-row>
                    <v-col cols="12" sm="4">
                      الخط <span class="mdi mdi-play"></span>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <select v-model="select_line" class="forms" @change="fetchAbonnesPrix(select_line)">
                        <option value="">اختر الخط</option>
                        <option v-for="ligne in lignes" :value="ligne.id">
                          {{
                            ligne.station_name +
                            " - " +
                            ligne.fin_station_name

                          }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-col cols="12" sm="12" class="montant" v-if="prix != 0">
                  {{ typ_yes }}<br />
                  السعر: {{ prix }} دينار<br />
                  + 3 دينار لمعالجة طلبات التسجيل عبر الإنترنت
                </v-col>
                <v-col cols="12" sm="12">
                  <div>
                    <div v-if="!paymentSessionId">
                      <v-btn @click="handleRegistration" class="bt-ics">سجّل</v-btn>
                    </div>

                    <!-- Payment Section -->
                    <div v-else>
                      <div class="btn-container">
                        <v-btn color="primary" @click="redirectToPaymentPage">انتقل إلى خطوة الدفع</v-btn>
                      </div>
                    </div>
                  </div>
                </v-col>
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
//import familleComponent from './familleComponent.vue'; // chokriiiii
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useAdminStore } from "@/store/auth";
definePageMeta({
  layout: "p",
});
const showFamilleComponent = ref(false);

const toggleFamilleComponent = () => {
  showFamilleComponent.value = !showFamilleComponent.value;
};
const csrf_token = ref(null);
const csrfToken = ref(null);
const type_abonne = ref("scolaire");
const image = ref("");
const select_prix = ref("");
const prix = ref(0);
const garess = ref([]);
const selectedGareId = ref(null);
const price = ref(0);
const date_debut = ref("");
const date_fin = ref("");
const typ_yes = ref("");
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
const typform = ref(null);
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
const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};
const num_order = generateRandomCode() + Date.now().toString();
const currencies = ["TND"];
const customer = ref({
  fname: "",
  lname: "",
  adresse: "",
  email: "",
  phone: "",
});

const order = ref({
  orderid: num_order,
  amount: price,
  currency: "TND",
  returnUrl: "https://api.srtk.com.tn/api/recue_paiement?orderid=" + num_order,
});

const merchant = {
  merchentid: 1751000728,
  login: "merchant.1751000728", // Add the correct login
  passwd: "87244402abefc802e378f4977b544610",
};

const paymentSessionId = ref("");
const backendResult = ref({});
onMounted(() => {
  loadMastercardCheckoutScript();
});

function loadMastercardCheckoutScript() {
  const script = document.createElement("script");
  script.src =
    "https://tnpost.gateway.mastercard.com/checkout/version/62/checkout.js";

  document.head.appendChild(script);

  // Wait for the script to load before using the Checkout object
}

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
      typ_yes.value = response.data.tarif.nom;
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

async function createSession() {
  try {
    console.log('cin=', cin);
    console.log('cin value=', cin.value);

    const response = await axios.post("https://api.srtk.com.tn/api/payement", {
      code: idd.value,
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
      order.amount = prix.value + 1 + 3;
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
    const hiddenAmount = prix.value;
    // Redirect the user to the payment page
    Checkout.configure({
      merchant: `${merchant.merchentid}`,
      session: {
        id: paymentSessionId.value,
      },
      order: {
        amount: prix.value,
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
    return data;
  } catch (error) {
    //console.error("Error fetching lignes:", error);
  }
}

async function fetchAbonnesligne(ids) {
  const lignesData = await fetchLignes(); // Attendre que fetchLignes se termine
  console.log(ids);
  console.log(lignesData);
  const filteredLignes = lignesData.filter(
    (item) => item.gare_id == ids
  );
  lignes.value = filteredLignes;
}



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
//typeecol === 'ecolpublic' && typabon === 'stagiaire'"
const filteredEtablissementstag = computed(() => {
  if (typeecol.value === "ecolpublic") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Etatique_formation"
    );
  } else if (typeecol.value === "ecolpriv") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Prive_formation"
    );
  } else {
    return [];
  }
});

const filteredEtablissements = computed(() => {
  if (typeetudfac.value === "facpublic") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Etatique_super"
    );
  } else if (typeetudfac.value === "facpriv") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "priv_super"
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
  prix.value = "";
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

const age = computed(() => {
  if (date_naissance.value) {
    const dob = new Date(date_naissance.value);
    const today = new Date();
    const ageInMillis = today - dob;
    const ageInYears = ageInMillis / (365 * 24 * 60 * 60 * 1000);
    return Math.floor(ageInYears);
  }
  return null;
});
const handleRegistration = async () => {
  customer.fname = prenom.value;
  customer.lname = nom_parent.value;
  customer.adresse = adresse.value;
  customer.email = email.value;
  customer.phone = num_telephone.value;
  order.amount = prix.value;
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
    prix.value,
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
  if (!image.value || cin.value.length === 0) {
    snackbar.value = {
      show: true,
      message: "Veuillez charger votre photo",
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


    return;
  }

  if (typform.value === 'cop' && age.value > 25) {
    snackbar.value = {
      show: true,
      message: "L'âge ne peut pas dépasser 25 ans.",
      color: "error",
    };
    return; // Stop form submission
  }
  if (typform.value === 'btp' && age.value > 30) {
    snackbar.value = {
      show: true,
      message: "L'âge ne peut pas dépasser 30 ans.",
      color: "error",
    };
    return; // Stop form submission
  }
  if (typform.value === 'bts' && age.value > 35) {
    snackbar.value = {
      show: true,
      message: "L'âge ne peut pas dépasser 35 ans.",
      color: "error",
    };
    return; // Stop form submission
  }
  //console.log(prix.value);

  let typeInscrit = typetudfac.value === "inscrit" ? "inscrit" : "non-inscrit";

  let typePeriode = semestre.value === "sem1" ? "sem1" : "annuel";

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



  const etablissement = etablissements.value.find(
    (item) => item.labelle === selected.value
  );
  const x = lignes.value.find((item) => item.name === select_line.value);

  const payload = {
    csrf_token: csrfToken.value,
    prix: prix.value,
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

    profession_fr: "",
    profession_en: "",
    profession_ar: "",

    ligne_id: ligne.value,
    Etablissement_id: selected.value,
    //type_eleve: typeEleve,
    type_validite: typeValidite,
    type_zone: selectedGareId.value,
    type_inscrit: typeInscrit,
    type_periode: semestre.value,
    type_paiment: typ_yes.value,
    type_institut: typeInstitut,
    type_eleve: typeEleve,
    etat: "En cours",
    image: image.value,
    orderid: num_order,
  };

  try {
    //console.log("ggg");

    await axios.post("https://api.srtk.com.tn/api/abonne/add", payload, { headers: headers });
    snackbar.value = {

      show: true,
      message: "Registration successful!",
      color: "success",
    };
    //console.log("sss");
    try {
      await createSession();

      // Redirect to the payment page if a payment session ID was successfully generated
      if (paymentSessionId.value) {
        snackbar.value = {
          show: true,
          message: "Veuillez compléter le processus de paiement.",
          color: "info",
        };

        //  redirectToPaymentPage(); // Only call this function here
      } else {
        // Handle the case where the payment session ID is not generated
        console.error("Payment Session ID is missing or not generated.");
        // You can show an error message or perform other actions here if needed.
      }
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle the error, show a message, or perform other actions if needed.
    }

    //console.log("mchit");
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
const loginp = () => {
  if (cin.value.length !== 8) {
    snackbarMessage.value = "CIN doit avoir 8 chiffres!";
    showSnackbar.value = true; // Show the snackbar
    return;
  }
  axios
    .post("https://api.srtk.com.tn/api/admin/loginp", {
      cin: cin.value,
      password: password.value,
    })
    .then((res) => {
      token.value = res.data.data.token;
      const adminStore = useAdminStore();
      adminStore.setCin(cin.value);

      localStorage.setItem("token", token.value);
      snackbarMessage.value = ""; // Clear the snackbar message
      // showSnackbar.value = true; // Show the snackbar
      navigateTo("/parent/list_urbain");
    })
    .catch((err) => {
      console.error("Erreur de connexion:", err);
      if (err.response.status === 404) {
        snackbarMessage.value = "Le CIN n'existe pas!";
      } else if (err.response.status === 401) {
        snackbarMessage.value = "Mot de passe incorrect!";
      } else {
        snackbarMessage.value = "Erreur de connexion.";
      }
      showSnackbar.value = true; // Show the snackbar
      //console.log(err.response.data.message);
    });
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

select {
  width: 100%;
  background-color: #f6f6f6;
  padding: 12px;
  border-radius: 5px;
  border: 0.3px solid #9f9f9f;
}
</style>
