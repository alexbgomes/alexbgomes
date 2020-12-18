<template>
    <section class="contact-card">
        <a :href="link" target="_blank">
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <!-- <b-icon :icon="icon"></b-icon> -->
                            <i :class="icon" />
                        </div>
                        <div class="media-content">
                            <p class="title is-4">{{ contact }}</p>
                            <p class="subtitle is-6">{{ type }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </section>
</template>

<script>
    export default {
        Name: 'ContactCard',
        props: {
            icon: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            contact: {
                type: String,
                required: true
            },
            link: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped>
    .contact-card {
        padding: 0.5rem;
    }
    .contact-card ::v-deep .media-left {
        font-size: 2.5rem;
    }

    .contact-card ::v-deep .media-content {
        overflow-x: inherit !important;
    }
</style>