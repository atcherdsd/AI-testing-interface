import { FormSchema } from '@/lib/schemas/questionsFormSchema';
import { differenceInYears } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const {
            childName,
            birthDate,
            section1,
            section2,
            section3,
            section4,
        } = data as FormSchema;

        let ageStr = '';
        if (typeof birthDate === 'string') {
            const parsed = new Date(birthDate);
            if (!isNaN(parsed.getTime())) {
                const age = differenceInYears(new Date(), parsed);
                ageStr = `${age}`;
            }
        }

        const reportLines: string[] = [];

        // Заголовок
        reportLines.push(`**Психологический отчёт о ребёнке ${ageStr ? (+ageStr > 0 ? (ageStr + ' лет') : 'до 1 года') : ''}**`);

        // Краткая сводка
        reportLines.push(`## 📚 Краткая сводка`);
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push(`* **Имя ребёнка:** ${childName}`);

        // Данные анализа рисунков
        reportLines.push(`* **Главное качество (рисунок "Дом")**: Потребность в безопасности.`);
        reportLines.push(`* **Основная черта (рисунок "Животное")**: Воображение и наблюдательность.`);
        reportLines.push(`* **Самооценка (автопортрет)**: Склонность к анализу, умеренная самокритика.`);
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('---');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');

        // Развёрнутые разделы
        reportLines.push('## 🔍 Развёрнутые разделы');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('### 1. Дом-Дерево-Человек: ключевые наблюдения');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('| Элемент | Особенности рисунка                 | Психологический вывод                   |');
        reportLines.push('');
        reportLines.push('| ------- | ----------------------------------- | --------------------------------------- |');
        reportLines.push('');
        reportLines.push('| Дом     | Уютный, с окнами, дымом, забором    | Потребность в безопасности, семья важна |');
        reportLines.push('');
        reportLines.push('| Дерево  | С корнями, пышная крона             | Устойчивость, рост, жизненная энергия   |');
        reportLines.push('');
        reportLines.push('| Человек | Маленький, руки прижаты, без эмоций | Скромность, неуверенность, сдержанность |');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('**Общий вывод:** Ребёнок чувствует себя в семье защищённо, но может быть сдержан в выражении эмоций и чувствует неуверенность в социальной среде.');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('---');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('### 2. Животное: детали и фантазия');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('* **Выбор животного:** Фантастическое или символическое существо (например, лиса с крыльями)');
        reportLines.push('* **Акценты в рисунке:** Большие глаза, уши — важность наблюдения, осторожность');
        reportLines.push('* **Позы и выражение:** Мирное выражение, сидячая поза — доброжелательность');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('**Вывод:** У ребёнка хорошо развито воображение, он склонен к рефлексии и наблюдательности. Может сдерживать активные эмоции, предпочитая анализ.');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('---');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('### 3. Автопортрет: особенности самовосприятия');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('* **Размер фигуры:** Маленький — возможна заниженная самооценка');
        reportLines.push('* **Выражение лица:** Нейтральное или отсутствует — сдержанность');
        reportLines.push('* **Дополнительные детали:** Нет фона или вторичных образов — неуверенность в социуме');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('**Вывод:** Ребёнок ориентирован на внешнюю оценку, нуждается в поддержке, особенно эмоциональной и словесной.');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('---');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('### 4. Опросник: суммарные баллы и профиль');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('| Шкала                      | Баллы (из 200) |');
        reportLines.push('');
        reportLines.push('| -------------------------- | ------------- |');
        reportLines.push('');

        const getResult = (object: Record<string, string>): number => (
            Object.values(object).reduce((value, acc) => +value + +acc, 0)
        );
        const sampleScores = {
            'Эмоциональная устойчивость': getResult(section1),
            'Социальная адаптация': getResult(section2),
            'Саморегуляция': getResult(section3),
            'Коммуникативность': getResult(section2) + getResult(section2) * 0.1,
            'Самооценка': getResult(section4),
        };
        for (const [scale, score] of Object.entries(sampleScores)) {
            reportLines.push(`| ${scale} | ${score} |`);
            reportLines.push('');
        }

        reportLines.push('&nbsp;');
        reportLines.push('#### Визуальный профиль (пример):');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('```');
        reportLines.push('  ■ Эмоц. устойчивость  [■■■■■□□□□□□□]');
        reportLines.push('  ■ Соц. адаптация      [■■■■■■■■□□□□]');
        reportLines.push('  ■ Саморегуляция       [■■■■□□□□□□□]');
        reportLines.push('  ■ Коммуникативность   [■■■■■■■■■□□□]');
        reportLines.push('  ■ Самооценка          [■■■□□□□□□□□]');
        reportLines.push('```');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('---');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('## 📖 Рекомендации для родителей');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('* Чаще хвалите ребёнка за конкретные действия, а не только за результат');
        reportLines.push('* Помогайте называть чувства: "Ты расстроился, потому что..."');
        reportLines.push('* Поддерживайте инициативу, даже если ребёнок ошибается');
        reportLines.push('* Создавайте спокойную и предсказуемую атмосферу дома');
        reportLines.push('* Поощряйте фантазию — сказки, рисунки, игры по ролям');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('---');
        reportLines.push('');
        reportLines.push('&nbsp;');
        reportLines.push('');
        reportLines.push('*Отчёт составлен на основе проектных методик и наблюдений. Является ориентиром для мягкой поддержки ребёнка в развитии.*');

        const markdown = reportLines.join('\n');

        return new NextResponse(markdown, {
            status: 200,
            headers: {
                'Content-Type': 'text/markdown; charset=utf-8',
            },
        });
    } catch (err) {
        console.error('Ошибка в API submit-survey:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
