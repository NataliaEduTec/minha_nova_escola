import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {StudentStatus} from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const schoolYear = () => {
    const date = new Date();
    const year = date.getFullYear();
    const years = []

    for (let i = 2024; i <= year; i++) {
        years.push(i);
    }

    return years;
}

export function handleStatusStudent(student: StudentStatus, questionId: number, studentId: number) {
    {
        if (student.id === studentId) {
            const question = student.questions.find((question) => question.id === questionId)

            if (question) {
                const questions = student.questions.filter((q) => q.id !== question.id)
                const status = question.status === "S/N" ? "SIM" : question.status === "SIM" ? "NÃO" : "S/N";

                return {
                    ...student,
                    questions: [
                        ...questions,
                        {
                            id: questionId,
                            status
                        },
                    ],
                    totalCorrects: status === "SIM" ? student.totalCorrects + 1 : status === "NÃO" ? student.totalCorrects - 1 : student.totalCorrects,
                    tabulated: true,
                }
            }

            return {
                ...student,
                questions: [
                    ...student.questions,
                    {
                        id: questionId,
                        status: "SIM"
                    },
                ],
                totalCorrects: student.totalCorrects + 1,
                tabulated: true,
            }
        }

        return student;
    }
}

export function getDefaultValues<T extends Record<string, any>>(): T {
    return {} as T;
}

export const quantityQuestions = [
    {
        value: "10",
        label: "10 questões"
    },
    {
        value: "11",
        label: "11 questões"
    },
    {
        value: "12",
        label: "12 questões"
    },
    {
        value: "13",
        label: "13 questões"
    },
    {
        value: "14",
        label: "14 questões"
    },
    {
        value: "15",
        label: "15 questões"
    },
    {
        value: "16",
        label: "16 questões"
    },
    {
        value: "17",
        label: "17 questões"
    },
    {
        value: "18",
        label: "18 questões"
    },
    {
        value: "19",
        label: "19 questões"
    },
    {
        value: "20",
        label: "20 questões"
    },
    {
        value: "21",
        label: "21 questões"
    },
    {
        value: "22",
        label: "22 questões"
    },
    {
        value: "23",
        label: "23 questões"
    },
    {
        value: "24",
        label: "24 questões"
    },
    {
        value: "25",
        label: "25 questões"
    },
]

export const defaultQuestions = [
    {
        id: 1,
        question: "QUESTÃO 01",
        indicator: null,
        color: "bg-[#66FF33]"
    },
    {
        id: 2,
        question: "QUESTÃO 02",
        indicator: null,
        color: "bg-[#66FF33]"
    },
    {
        id: 3,
        question: "QUESTÃO 03",
        indicator: null,
        color: "bg-[#FFC000]"
    },
    {
        id: 4,
        question: "QUESTÃO 04",
        indicator: null,
        color: "bg-[#FFC000]"
    },
    {
        id: 5,
        question: "QUESTÃO 05",
        "indicator": null,
        "color": "bg-[#FFFF00]"
    },
    {
        id: 6,
        question: "QUESTÃO 06",
        indicator: null,
        color: "bg-[#FFFF00]"
    },
    {
        id: 7,
        question: "QUESTÃO 07",
        indicator: null,
        color: "bg-[#FF3399]"
    },
    {
        id: 8,
        question: "QUESTÃO 08",
        indicator: null,
        color: "bg-[#FF3399]"
    },
    {
        id: 9,
        question: "QUESTÃO 09",
        indicator: null,
        color: "bg-[#00FFCC]"
    },
    {
        id: 10,
        question: "QUESTÃO 10",
        indicator: null,
        color: "bg-[#00FFCC]"
    },
]

export const createNewStudentWithQuestions = (prevStudents: StudentStatus[], studentId: number, questionId: number) => {
    return [
        ...prevStudents,
        {
            id: studentId,
            questions: [
                ...prevStudents[studentId]?.questions ?? [],
                {
                    id: questionId,
                    status: "SIM",
                }
            ],
            totalCorrects: 1,
            tabulated: true,
        }
    ]
}

export const indicatorTypes = [
    { label: "BNCC", value: "bncc" },
    { label: "SAEB", value: "saeb" },
    { label: "SABE", value: "sabe" },
]