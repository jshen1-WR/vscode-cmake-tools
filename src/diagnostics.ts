import {util} from './util';

type Maybe<T> = util.Maybe<T>;

export interface RawDiagnostic {
    full: string;
    file: string;
    line: number;
    column: number;
    severity: string;
    message: string;
}


export function parseGCCDiagnostic(line: string): Maybe<RawDiagnostic> {
    const gcc_re = /^(.*):(\d+):(\d+):\s+(?:fatal )?(warning|error|note):\s+(.*)$/;
    const res = gcc_re.exec(line);
    if (!res)
        return null;
    const [full, file, lineno, column, severity, message] = res;
    if (file && lineno && column && severity && message) {
        return {
            full: full,
            file: file,
            line: parseInt(lineno) - 1,
            column: parseInt(column) - 1,
            severity: severity,
            message: message
        };
    } else {
        return null;
    }
}

export function parseGNULDDiagnostic(line): Maybe<RawDiagnostic> {
    const ld_re = /^(.*):(\d+):\s+(.*)$/;
    const res = ld_re.exec(line);
    if (!res) {
        return null;
    }
    const [full, file, lineno, message] = res;
    if (file && lineno && message) {
        return {
            full: full,
            file: file,
            line: parseInt(lineno) - 1,
            column: 0,
            severity: 'error',
            message: message,
        };
    } else {
        return null;
    }
}

export function parseGHSDiagnostic(line: string): Maybe<RawDiagnostic> {
    const gcc_re = /^\"(.*)\",\s+(?:(?:line\s+(\d+)\s+\(col\.\s+(\d+)\))|(?:At end of source)):\s+(?:fatal )?(remark|warning|error)\s+(.*)/;
    const res = gcc_re.exec(line);
    if (!res)
        return null;
    const [full, file, lineno = '1', column = '1', severity, message] = res;
    if (file && severity && message) {
        return {
            full: full,
            file: file,
            line: parseInt(lineno) - 1,
            column: parseInt(column) - 1,
            severity: severity,
            message: message
        };
    } else {
        return null;
    }
}
