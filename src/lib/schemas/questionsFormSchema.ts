import { z } from 'zod';

const minBirthDate = new Date('2010-01-01');
const today = new Date();

export const formSchema = z.object({
    childName: z.string().trim().min(1, 'Введите имя'),
    birthDate: z.date({
        required_error: 'Введите дату рождения ребенка',
    }).refine(
        (date) => date >= minBirthDate && date <= today,
        { message: 'Введите корректную дату рождения ребенка (не старше 14 лет)' }
    ),
    gender: z.enum(['male', 'female']),
    parentName: z.string().trim().min(1, 'Введите имя'),

    section1: z.object({
        q1: z.string().min(1),
        q2: z.string().min(1),
        q3: z.string().min(1),
        q4: z.string().min(1),
        q5: z.string().min(1),
        q6: z.string().min(1),
        q7: z.string().min(1),
        q8: z.string().min(1),
        q9: z.string().min(1),
        q10: z.string().min(1),
    }),
    section2: z.object({
        q1: z.string().min(1),
        q2: z.string().min(1),
        q3: z.string().min(1),
        q4: z.string().min(1),
        q5: z.string().min(1),
        q6: z.string().min(1),
        q7: z.string().min(1),
        q8: z.string().min(1),
        q9: z.string().min(1),
        q10: z.string().min(1),
    }),
    section3: z.object({
        q1: z.string().min(1),
        q2: z.string().min(1),
        q3: z.string().min(1),
        q4: z.string().min(1),
        q5: z.string().min(1),
        q6: z.string().min(1),
        q7: z.string().min(1),
        q8: z.string().min(1),
        q9: z.string().min(1),
        q10: z.string().min(1),
    }),
    section4: z.object({
        q1: z.string().min(1),
        q2: z.string().min(1),
        q3: z.string().min(1),
        q4: z.string().min(1),
        q5: z.string().min(1),
        q6: z.string().min(1),
        q7: z.string().min(1),
        q8: z.string().min(1),
        q9: z.string().min(1),
        q10: z.string().min(1),
    }),
    section5: z.object({
        radio: z.string().min(1),
        free1: z.string().trim().min(1, 'Поле обязательно для заполнения'),
        free2: z.string().trim().min(1, 'Поле обязательно для заполнения'),
        free3: z.string().trim().min(1, 'Поле обязательно для заполнения'),
        free4: z.string().trim().min(1, 'Поле обязательно для заполнения'),
    }),
});

export type FormSchema = z.infer<typeof formSchema>;
