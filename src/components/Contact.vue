<template>
    <section class="contact">
        <div 
            class="LI-profile-badge" 
            data-version="v1" 
            data-size="large" 
            data-locale="en_US" 
            data-type="horizontal" 
            data-theme="dark" 
            data-vanity="alexbgomes">
            <a class="LI-simple-link" href='https://ca.linkedin.com/in/alexbgomes?trk=profile-badge'>Alex Gomes</a>
        </div>
        <calendar>
            <h1>My Professional Availability</h1>
        </calendar>
    </section>
</template>

<script>
import Calendar from './Calendar'

export default {
    name: 'Contact',
    components: {
        Calendar
    },
    mounted() {
        let linkedInScript = document.createElement('script')
        linkedInScript.async = true
        linkedInScript.defer = true
        linkedInScript.setAttribute('src', 'https://platform.linkedin.com/badges/js/profile.js')
        document.head.appendChild(linkedInScript)
    }
}
</script>

<style scoped>
    .contact > .LI-profile-badge {
        padding-top: 1rem;
    }

    /* Hiding Edu link on LinkedIn since current employment === edu, so it appears twice, remove when employment !== edu */
    .contact > .LI-profile-badge ::v-deep ul.LI-more-info > li:nth-child(2) {
        display: none; 
    }
</style>