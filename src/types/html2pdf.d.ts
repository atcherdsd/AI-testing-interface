declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | [number, number, number, number];
        filename?: string;
        image?: {
            type?: 'jpeg' | 'png';
            quality?: number;
        };
        html2canvas?: {
            scale?: number;
        };
        jsPDF?: {
            unit?: string;
            format?: string | number[];
            orientation?: 'portrait' | 'landscape';
        };
        pagebreak?: {
            mode?: string | string[];
            before?: string | string[];
            after?: string | string[];
            avoid?: string | string[];
        };
        enableLinks?: boolean;
    }

    interface Html2Pdf {
        from(element: HTMLElement | string): Html2Pdf;
        set(options: Partial<Html2PdfOptions>): Html2Pdf;
        toPdf(): Html2Pdf;
        outputPdf(type?: string): Promise<string|Blob>;
        save(filename?: string): Promise<void>;
        output(type: string): Promise<string>;
    }

    function html2pdf(): Html2Pdf;

    export = html2pdf;
}
