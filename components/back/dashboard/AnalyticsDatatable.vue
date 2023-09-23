<script setup>
const data = [
    {
        responsiveId: '',
        id: 95,
        fullName: 'Edwina Ebsworth',
        post: 'Human Resources Assistant',
        email: 'eebsworth2m@sbwire.com',
        city: 'Puzi',
        start_date: '09/27/2018',
        salary: 19586.23,
        age: '27',
        experience: '2 Years',
        status: 1,
    },
    {
        responsiveId: '',
        id: 1,
        fullName: 'Korrie O\'Crevy',
        post: 'Nuclear Power Engineer',
        email: 'kocrevy0@thetimes.co.uk',
        city: 'Krasnosilka',
        start_date: '09/23/2016',
        salary: 23896.35,
        age: '61',
        experience: '1 Year',
        status: 2,
    },
    {
        responsiveId: '',
        id: 7,
        fullName: 'Eileen Diehn',
        post: 'Environmental Specialist',
        email: 'ediehn6@163.com',
        city: 'Lampuyang',
        start_date: '10/15/2017',
        salary: 18991.67,
        age: '59',
        experience: '9 Years',
        status: 3,
    },
    {
        responsiveId: '',
        id: 11,
        fullName: 'De Falloon',
        post: 'Sales Representative',
        email: 'dfalloona@ifeng.com',
        city: 'Colima',
        start_date: '06/12/2018',
        salary: 19252.12,
        age: '30',
        experience: '0 Year',
        status: 4,
    },

]
const status = {
    1: 'Current',
    2: 'Professional',
    3: 'Rejected',
    4: 'Resigned',
    5: 'Applied',
}
const statusColor = {
    Current: 'primary',
    Professional: 'success',
    Rejected: 'error',
    Resigned: 'warning',
    Applied: 'info',
}
const headers = [
    'NOM',
    'EMAIL',
    'DATE',
    'TARIF',
    'SEMESTRE',
    'STATUS',
]
const usreList = data
</script>

<template>
    <VCard>
        <VTable :headers="headers" :items="usreList" item-key="fullName" class="table-rounded" hide-default-footer
            disable-sort>
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header">
                        {{ header }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="row in data" :key="row.fullName">
                    <!-- name -->

                    <td>
                        <div class="d-flex flex-column">
                            <span class="d-block font-weight-semibold text--primary text-truncate">{{ row.fullName }}</span>
                            <small>{{ row.post }}</small>
                        </div>
                    </td>

                    <td v-text="row.email" />
                    <td v-text="row.start_date" />
                    <td v-text="`$${row.salary}`" />
                    <td v-text="row.age" />
                    <!-- status -->
                    <td>
                        <VChip small :color="statusColor[status[row.status]]" class="font-weight-medium">
                            {{ status[row.status] }}
                        </VChip>
                    </td>
                </tr>
            </tbody>
        </VTable>
    </VCard>
</template>
