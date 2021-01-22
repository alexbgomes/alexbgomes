<template>
    <section class='calendar'>
        <slot></slot>
        <vue-cal
            :disable-views="disableViews"
            :time-from="timeFrom"
            :time-to="timeTo"
            :time-cell-height="timeCellHeight"
            :events="events"
            :selected-date="selectedDate"
            startWeekOnSunday
            small
            today-button>
            <template v-slot:today-button>
                <b-tooltip 
                    label="Today"
                    type="is-dark"
                    position="is-bottom">
                    <button class="button">
                        <b-icon icon="crosshairs"></b-icon>
                    </button>
                </b-tooltip>
            </template>
        </vue-cal>
    </section>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
    name: 'Calendar',
    data () {
        return {
            windowWidth: window.innerWidth,
            disableViews: ['years', 'year', 'month', 'day', 'week'],
            timeFrom: 8 * 60,
            timeTo: 18 * 60,
            /* timeCellHeight: 100, */
            selectedDate: new Date(),
            holidays: [],
            events: [].concat(
                this.recurEvent('2021-01-11', '2021-08-31', '09:00', '17:00', 'weekday', 'Work', '<i class="icon fas fa-briefcase"></i>', 'work'),
                )
        }
    },
    components: {
        VueCal
    },
    mounted() {
        this.$nextTick(function() {
            window.addEventListener('resize', this.getWindowWidth);
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.getWindowWidth);
    },
    methods: {
        getWindowWidth() {
            this.windowWidth = window.innerWidth
        },
        /**
         * Start and End should follow the following format: YYYY-MM-DD
         * From and To should follow the following format: HH:MM
         * The time format is 24hr, month and date, must fit into exact character count, use leading zeroes
         */
        recurEvent(start, end, from, to, every='day', eventTitle, htmlContent, eventClass) {
            let recurringEvent = []

            function CalendarEvent(curStart, curEnd) {
                return {
                    start: curStart,
                    end: curEnd,
                    title: eventTitle,
                    content: htmlContent,
                    class: eventClass
                }
            }

            function fmtDate(dateStr) {
                let dt = new Date(dateStr)
                function pad(num, size=2) {
                    let str = String(num)
                    let rem = size - str.length
                    return `${"0".repeat(rem)}${num}`
                }
                return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`
            }

            let startEpoch = new Date(`${start} ${from}`).valueOf()
            let endEpoch = new Date(`${end} ${to}`).valueOf()

            if (endEpoch < startEpoch)
                throw new Error('End date must succeed start date.')

            let fromParts = from.split(":")
            let toParts = to.split(":") 
            let fromHour = parseInt(fromParts[0])
            let toHour = parseInt(toParts[0])
            let fromMin = parseInt(fromParts[1])
            let toMin = parseInt(toParts[1])

            if ((toHour < fromHour) || (toHour == fromHour && toMin < fromMin))
                throw new Error('End time must succeed start time.')

            let curEpoch = startEpoch

            let cur = new Date(curEpoch)

            while (curEpoch < endEpoch) {
                let dayStr = fmtDate(cur)
                recurringEvent.push(new CalendarEvent(`${dayStr} ${from}`, `${dayStr} ${to}`))

                if (every === 'day')
                    cur.setDate(cur.getDate() + 1)
                else if (every === 'weekday') {
                    if (cur.getDay() === 5)
                        cur.setDate(cur.getDate() + 3)
                    else
                        cur.setDate(cur.getDate() + 1)
                } else if (every === 'week')
                    cur.setDate(cur.getDate() + 7)
                else if (every === 'month')
                    cur.setMonth(cur.getMonth() + 1)
                else if (every === 'year')
                    cur.setFullYear(cur.getFullYear() + 1)
                else if (typeof(every) == "number")
                    cur.setDate(cur.getDate() + every)

                curEpoch = cur.valueOf()
            }

            return recurringEvent
        }
    },
    computed: {
        timeCellHeight() {
            return this.windowWidth < 768
                    ? 50
                    : 100
        }
    }
}
</script>

<style scoped>
    .calendar {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }
    .calendar > .vuecal {
        margin-left: auto;
        margin-right: auto;
    }
    .calendar ::v-deep .work {
        background-color: hsla(214, 85%, 50%, .85);
        border: 1px solid #1371ec;
        color: #fff;
    }

    @media (max-width: 426px) {
        .calendar ::v-deep .vuecal__cell-events {
            font-size: 0.45rem;
        }

        .calendar ::v-deep .vuecal__no-event {
            font-size: 0.7rem;
        }
    }
</style>