import {
    CalendarOptions,
    EventInput,
    EventClickArg,
    DateSelectArg,
    EventChangeArg,
    ViewApi,
    EventSourceInput,
} from '@fullcalendar/core';


export default interface ICalendar extends React.HTMLAttributes<HTMLDivElement> {
    customClassName?: string;
    // events?: IEvents[]
    events?: EventInput[];
    options?: CalendarOptions;
    eventClick?: (arg: EventClickArg) => void;
    dateSelect?: (arg: DateSelectArg) => void;
    eventChange?: (arg: EventChangeArg) => void;
    currentView?: ViewApi;
    customEventSource?: EventSourceInput;
    onSelectDay?: (arg: DateSelectArg | null,type: string) => void
}
