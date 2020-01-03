<template>
    <section class='calendar'>
        <vue-cal
            :disable-views="disableViews"
            :time-from="timeFrom"
            :time-to="timeTo"
            :time-cell-height="timeCellHeight"
            :events="events"
            :selected-date="selectedDate"
            hide-weekends
            small
            today-buton>
            <template v-slot:today-button>
                <b-tooltip 
                    label="Today"
                    type="is-dark"
                    position="is-bottom">
                    <button class="button">
                        <b-icon icon="location" size="is-small"></b-icon>
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
            disableViews: ['years', 'year', 'month', 'day', 'week'],
            timeFrom: 8 * 60,
            timeTo: 18 * 60,
            timeCellHeight: 100,
            selectedDate: new Date(),
            holidays: ['2020-02-17',
                       '2020-02-18',
                       '2020-02-19',
                       '2020-02-20',
                       '2020-02-21'],
            events: [].concat(
                //Mondays
                this.recurEvent('2020-01-13', '2020-04-09', '09:00', '10:00', 'week', 'CHY103 - Lec A', '<i class="icon fas fa-flask"></i>', 'chem-uni'),
                this.recurEvent('2020-01-13', '2020-04-09', '11:00', '13:00', 'week', 'HST701 - Lec A', '<i class="icon fas fa-landmark"></i>', 'hist-uni'),
                this.recurEvent('2020-01-13', '2020-04-09', '14:00', '16:00', 'week', 'CPS616 - Lec A', '<i class="icon fas fa-code"></i>', 'algo-uni'),
                //Tuesdays
                this.recurEvent('2020-01-14', '2020-04-09', '09:00', '10:00', 'week', 'HST701- Lec B', '<i class="icon fas fa-landmark"></i>', 'hist-uni'),
                this.recurEvent('2020-01-14', '2020-04-09', '13:00', '14:00', 'week', 'CPS616- Lab', '<i class="icon fas fa-code"></i>', 'algo-uni'),
                this.recurEvent('2020-01-14', '2020-04-09', '17:00', '18:00', 'week', 'CPS616- Lec B', '<i class="icon fas fa-code"></i>', 'algo-uni'),
                //Wednesdays
                this.recurEvent('2020-01-15', '2020-04-09', '08:00', '09:00', 'week', 'CPS706 - Lec A', '<i class="icon fas fa-server"></i>', 'ntwk-uni'),
                this.recurEvent('2020-01-15', '2020-04-09', '14:00', '15:00', 'week', 'CPS706 - Lab', '<i class="icon fas fa-server"></i>', 'ntwk-uni'),
                //Thursdays
                this.recurEvent('2020-01-16', '2020-04-09', '08:00', '10:00', 'week', 'CHY103 - Lec B', '<i class="icon fas fa-flask"></i>', 'chem-uni'),
                this.recurEvent('2020-01-16', '2020-04-09', '10:00', '12:00', 'week', 'MTH310 - Lec A', '<i class="icon fas fa-square-root-alt"></i>', 'calc-uni'),
                this.recurEvent('2020-01-16', '2020-04-09', '14:00', '16:00', 'week', 'CPS706 - Lec B', '<i class="icon fas fa-server"></i>', 'ntwk-uni'),
                //Fridays
                this.recurEvent('2020-01-17', '2020-04-09', '12:00', '13:00', 'week', 'MTH310 - Lab', '<i class="icon fas fa-square-root-alt"></i>', 'calc-uni'),
                this.recurEvent('2020-01-17', '2020-04-09', '14:00', '16:00', 'week', 'MTH310 - Lec B', '<i class="icon fas fa-square-root-alt"></i>', 'calc-uni'),
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
            window.innerWidth < 768
                ? this.timeCellHeight = 50
                : this.timeCellHeight = 100
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
                else if (every === 'week')
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
    }
}
</script>

<style scoped>
    .calendar > .vuecal {
        margin-left: auto;
        margin-right: auto;
    }
    .calendar ::v-deep .chem-uni {
        background-color: hsla(0, 100%, 70%, .85);
        border: 1px solid #eb5252;
        color: #fff;
    }
    .calendar ::v-deep .hist-uni {
        background-color: hsla(72, 80%, 50%, .85);
        border: 1px solid #bde619;
        color: #444;
    }
    .calendar ::v-deep .algo-uni {
        background-color: hsla(214, 85%, 50%, .85);
        border: 1px solid #1371ec;
        color: #fff;
    }
    .calendar ::v-deep .ntwk-uni {
        background-color: hsla(276, 85%, 75%, .85);
        border: 1px solid #ca89f5;
        color: #444;
    }
    .calendar ::v-deep .calc-uni {
        background-color: hsla(58, 85%, 60%, .85);
        border: 1px solid #f0ea42;
        color: #444;
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