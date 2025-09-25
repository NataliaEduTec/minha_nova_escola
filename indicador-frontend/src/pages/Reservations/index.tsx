import Calendar from "../../components/Calendar";
import React, {useEffect, useState} from "react";
import {DateSelectArg} from "@fullcalendar/core";
import FormResevations from "../../components/Reservations/Form";
import Modal from "../../components/Modal";
import {showToast} from "../../components/General/Notification";
import ReservationsApi, {TReservationsFormValues} from "../../services/reservations.ts";
import useModal from "../../hooks/useModal";
import {defaultValues} from "../../components/Reservations/Form/schema";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    onSelectDay?: (arg: null | DateSelectArg) => void
}

export default function Reservations({ style }: Props) {

    const {modalRef, openModal: handleOpenModal, closeModal: handleCloseModal } = useModal();

    const [reservations, setReservations] = useState<TReservationsFormValues[]>([])
    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false)
    const [idReservation, setID] = useState<number>(0)
    const [reservation, setReservation] = useState<TReservationsFormValues>(defaultValues)
    const [reset, setReset] = useState<boolean>(false)
    const [reloadReservations, setReloadReservations] = useState<boolean>(false)
    const [permission, setPermission] = useState<boolean>(false);

    useEffect(() => {
        getAll().then(i => setReservations(i ?? []))
    }, [reloadReservations]);

    const getAll = async (): Promise<TReservationsFormValues[] | undefined> => {
        const response = await ReservationsApi.getAll<TReservationsFormValues[]>()

        if (response.status !== "success"){
            showToast(response.message, response.status)
            return
        }

        return response.data
    }

    const openModal = () =>  {
        setReset(!reset)
        handleOpenModal()
    }

    const handleEdit = async (id: number) => {
        setIsLoadingForm(true)
        handleOpenModal()
        setID(id)

        const response = await ReservationsApi.getUnique<TReservationsFormValues>(id)
        setIsLoadingForm(false)

        if (response.status !== "success"){
            showToast(response.message, response.status)
            handleCloseModal()
            return
        }

        setReservation(response.data)
    }

    return (
        <main style={style} className={"w-full h-full flex justify-center items-center"}>
            <Modal ref={modalRef}>
                <FormResevations

                     onClick={() => {
                         setIsLoadingForm(false)
                         handleCloseModal()
                     }}
                     reset={reset}

                     handleCloseModal={handleCloseModal}

                     idReservation={idReservation}
                     reloadReservations={reloadReservations}
                     setReloadReservations={setReloadReservations}
                     permission={permission}
                     setPermission={setPermission}

                     loading={isLoadingForm}
                     reservation={reservation}
                />
            </Modal>
            <section className={"w-full max-w-screen-xl max-h-screen"}>
                <Calendar
                    onSelectDay={() => {
                        openModal()
                        setID(0)
                        setPermission(false)
                    }}
                    customClassName="border"
                    style={{
                        height: "600px",
                        width: "100%",
                    }}
                    eventClick={(arg) => handleEdit(parseInt(arg.event.id))}
                    events={
                        reservations.map(r => ({
                            id: r.id_reserva.toString(),
                            title: r.instalacao?.nome ? r.instalacao?.nome : "Reserva",
                            date: r.inicio_reserva
                        }))
                    }
                />
            </section>
        </main>
    )
}