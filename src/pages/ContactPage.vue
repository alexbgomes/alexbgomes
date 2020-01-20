<template>
    <section class="contact">
        <!-- <div 
            class="LI-profile-badge" 
            data-version="v1" 
            data-size="large" 
            data-locale="en_US" 
            data-type="horizontal" 
            data-theme="dark" 
            data-vanity="alexbgomes">
            <a class="LI-simple-link" href='https://ca.linkedin.com/in/alexbgomes?trk=profile-badge'>Alex Gomes</a>
        </div> -->
        <div class='level cards'>
            <contact-card
                type='Email'
                contact='alex.gomes@ryerson.ca'
                link='mailto:alex.gomes@ryerson.ca'
                icon='fas fa-envelope' />
            <contact-card
                type='GitHub'
                contact='alexbgomes'
                link='https://github.com/alexbgomes'
                icon='fab fa-github-square' />
            <contact-card
                type='LinkedIn'
                contact='in/alexbgomes'
                link='https://www.linkedin.com/in/alexbgomes/'
                icon='fab fa-linkedin' />
        </div>
        <calendar>
            <h1>My Professional Availability</h1>
        </calendar>
    </section>
</template>

<script>
import ContactCard from '../components/ui/ContactCard'
import Calendar from '../components/ui/CalendarAvailability'

export default {
    name: 'Contact',
    components: {
        Calendar,
        ContactCard
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

    .contact > .cards > .contact-card {
        width: 100%;
    }

    .contact > .cards {
        padding: 1rem 1rem 0 1rem;
    }
</style>