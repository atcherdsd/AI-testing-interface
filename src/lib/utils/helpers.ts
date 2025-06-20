export function animateResizeTextarea(el: HTMLTextAreaElement) {
    const prevHeight = el.getBoundingClientRect().height;

    el.style.height = 'auto';
    const newHeight = el.scrollHeight;

    el.style.height = `${prevHeight}px`;

    requestAnimationFrame(() => {
        el.style.height = `${newHeight}px`;
    });
}

export function debounce(fn: () => void, delay: number) {
    let timer: ReturnType<typeof setTimeout>;

    return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
}

export function isValidDate(val: unknown): val is Date {
    return val instanceof Date && !isNaN(val.getTime());
}

export function parseAndValidateDateString(
    str: string
): { date?: Date; error?: string } {

    // 1. проверка формата dd.MM.yyyy
    const formatRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
    const result = formatRegex.exec(str);
    if (!result) {
        return { error: 'Введите дату в формате ДД.MM.ГГГГ' };
    }

    // 2. проверка существования даты
    const [dd, mm, yyyy] = result.slice(1).map(Number);
    const parsed = new Date(yyyy, mm - 1, dd);
    if (
        isNaN(parsed.getTime()) ||
        parsed.getDate() !== dd ||
        parsed.getMonth() !== mm - 1 ||
        parsed.getFullYear() !== yyyy
    ) {
        return { error: 'Неверная дата' };
    }

    return { date: parsed };
}
