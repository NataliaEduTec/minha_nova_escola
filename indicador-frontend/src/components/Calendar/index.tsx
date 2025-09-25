import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ICalendar from "./ICalendar.ts";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import {useRef} from "react";
import {DateSelectArg} from "@fullcalendar/core";

export default function Calendar({ customClassName = "", style, events, onSelectDay, ...props }: ICalendar) {

    const calendarRef = useRef<FullCalendar | null>(null);

    const handleSelect = (arg: DateSelectArg) => {
        const calendarApi = calendarRef.current?.getApi();

        if (arg.allDay) {
            // calendarApi?.changeView('timeGridDay', arg.start);
            if (onSelectDay) {
                onSelectDay(arg, "day")
            }
        } else {
            if (onSelectDay) {
                onSelectDay(arg, "hour")
            }
        }

        calendarApi?.unselect();
    };

    return (
        <div className={`bg-white text-black shadow-xl rounded-xl border-4 border-opacity-50 border-gray-200 p-4 ${customClassName}`} style={style} {...props}>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}

                eventClick={props.eventClick}
                selectable={true}
                select={handleSelect}
                longPressDelay={1}
                selectLongPressDelay={1}
                handleWindowResize={true}

                dayPopoverFormat={{
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                }}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    omitZeroMinute: false,
                    meridiem: 'short'
                }}
                locale={ptBrLocale}
                height="100%"
                events={events}
                editable={true}
                dayMaxEvents={true}
                allDaySlot={false}
                slotDuration={'00:05:00'}
                slotLabelInterval={'01:00:00'}
                initialDate={new Date()}
            />
        </div>
    )
}