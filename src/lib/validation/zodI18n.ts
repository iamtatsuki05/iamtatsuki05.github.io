import type { Locale } from '@/lib/i18n';
import type { z, ZodError, ZodIssue } from 'zod';

export const DEFAULT_ZOD_ERROR_LOCALE = 'ja' satisfies Locale;

const valueTypeLabels = {
  ja: {
    string: '文字列',
    number: '数値',
    boolean: '真偽値',
    date: '日付',
    array: '配列',
    object: 'オブジェクト',
    default: '正しい形式',
  },
  en: {
    string: 'a string',
    number: 'a number',
    boolean: 'a boolean',
    date: 'a date',
    array: 'an array',
    object: 'an object',
    default: 'a valid value',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export const zodCustomErrorMessages = {
  'validation.custom.slugLowercase': {
    ja: '半角英小文字、数字、ハイフンで入力してください',
    en: 'Use lowercase letters, numbers, and hyphens',
  },
} as const satisfies Record<string, Record<Locale, string>>;

export type ZodCustomErrorKey = keyof typeof zodCustomErrorMessages;

type MessageContext = {
  expected?: string;
  minimum?: string;
  maximum?: string;
  format?: string;
  origin?: string;
};

type StandardMessageDictionary = {
  required: string;
  invalidType: (context: MessageContext) => string;
  invalidEmail: string;
  invalidFormat: string;
  tooSmall: (context: MessageContext) => string;
  tooBig: (context: MessageContext) => string;
  invalidValue: string;
  invalidUnion: string;
  unrecognizedKeys: string;
  custom: string;
  fallback: string;
};

export const zodErrorDictionaries: Record<Locale, { standard: StandardMessageDictionary; custom: Record<ZodCustomErrorKey, string> }> = {
  ja: {
    standard: {
      required: '必須項目です',
      invalidType: ({ expected }) => `${expected ?? valueTypeLabels.ja.default}で入力してください`,
      invalidEmail: 'メールアドレスの形式で入力してください',
      invalidFormat: '正しい形式で入力してください',
      tooSmall: ({ origin, minimum }) => {
        if (origin === 'string') return `${minimum}文字以上で入力してください`;
        if (origin === 'array') return `${minimum}件以上選択してください`;
        return `${minimum}以上で入力してください`;
      },
      tooBig: ({ origin, maximum }) => {
        if (origin === 'string') return `${maximum}文字以下で入力してください`;
        if (origin === 'array') return `${maximum}件以下で選択してください`;
        return `${maximum}以下で入力してください`;
      },
      invalidValue: '許可された値を選択してください',
      invalidUnion: '入力内容を確認してください',
      unrecognizedKeys: '未対応の項目が含まれています',
      custom: '入力内容を確認してください',
      fallback: '入力内容を確認してください',
    },
    custom: {
      'validation.custom.slugLowercase': zodCustomErrorMessages['validation.custom.slugLowercase'].ja,
    },
  },
  en: {
    standard: {
      required: 'This field is required',
      invalidType: ({ expected }) => `Enter ${expected ?? valueTypeLabels.en.default}`,
      invalidEmail: 'Enter a valid email address',
      invalidFormat: 'Enter a valid format',
      tooSmall: ({ origin, minimum }) => {
        if (origin === 'string') return `Enter at least ${minimum} characters`;
        if (origin === 'array') return `Select at least ${minimum} items`;
        return `Enter ${minimum} or more`;
      },
      tooBig: ({ origin, maximum }) => {
        if (origin === 'string') return `Enter ${maximum} characters or fewer`;
        if (origin === 'array') return `Select ${maximum} items or fewer`;
        return `Enter ${maximum} or less`;
      },
      invalidValue: 'Select an allowed value',
      invalidUnion: 'Check the input',
      unrecognizedKeys: 'Unsupported fields are included',
      custom: 'Check the input',
      fallback: 'Check the input',
    },
    custom: {
      'validation.custom.slugLowercase': zodCustomErrorMessages['validation.custom.slugLowercase'].en,
    },
  },
};

export type LocalizedZodIssue = {
  path: string;
  message: string;
  code: ZodIssue['code'];
  key?: ZodCustomErrorKey;
};

export type LocalizedZodError = {
  issues: LocalizedZodIssue[];
  fieldErrors: Record<string, LocalizedZodIssue[]>;
  formErrors: LocalizedZodIssue[];
};

export type LocalizedSafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: LocalizedZodError; zodError: ZodError };

export function zodCustomError(key: ZodCustomErrorKey): { error: ZodCustomErrorKey } {
  return { error: key };
}

export function formatZodIssue(issue: ZodIssue, locale: Locale = DEFAULT_ZOD_ERROR_LOCALE): string {
  const dictionary = zodErrorDictionaries[locale];
  const customKey = getCustomErrorKey(issue);
  if (customKey) return dictionary.custom[customKey];

  switch (issue.code) {
    case 'invalid_type': {
      if (issue.message.includes('received undefined')) return dictionary.standard.required;
      return dictionary.standard.invalidType({
        expected: getValueTypeLabel(locale, issue.expected),
      });
    }
    case 'invalid_format':
      if (issue.format === 'email') return dictionary.standard.invalidEmail;
      return dictionary.standard.invalidFormat;
    case 'too_small':
      return dictionary.standard.tooSmall({
        origin: issue.origin,
        minimum: String(issue.minimum),
      });
    case 'too_big':
      return dictionary.standard.tooBig({
        origin: issue.origin,
        maximum: String(issue.maximum),
      });
    case 'invalid_value':
      return dictionary.standard.invalidValue;
    case 'invalid_union':
      return dictionary.standard.invalidUnion;
    case 'unrecognized_keys':
      return dictionary.standard.unrecognizedKeys;
    case 'custom':
      return dictionary.standard.custom;
    default:
      return dictionary.standard.fallback;
  }
}

export function formatZodError(error: ZodError, locale: Locale = DEFAULT_ZOD_ERROR_LOCALE): LocalizedZodError {
  const issues = error.issues.map((issue) => localizeIssue(issue, locale));
  const fieldErrors: Record<string, LocalizedZodIssue[]> = {};
  const formErrors: LocalizedZodIssue[] = [];

  for (const issue of issues) {
    if (!issue.path) {
      formErrors.push(issue);
      continue;
    }

    fieldErrors[issue.path] = [...(fieldErrors[issue.path] ?? []), issue];
  }

  return { issues, fieldErrors, formErrors };
}

export function safeParseLocalized<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown,
  locale: Locale = DEFAULT_ZOD_ERROR_LOCALE,
): LocalizedSafeParseResult<z.output<TSchema>> {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    error: formatZodError(result.error, locale),
    zodError: result.error,
  };
}

function localizeIssue(issue: ZodIssue, locale: Locale): LocalizedZodIssue {
  const key = getCustomErrorKey(issue);
  return {
    path: formatIssuePath(issue.path),
    message: formatZodIssue(issue, locale),
    code: issue.code,
    ...(key ? { key } : {}),
  };
}

function getCustomErrorKey(issue: ZodIssue): ZodCustomErrorKey | undefined {
  if (issue.code !== 'custom') return undefined;
  return isZodCustomErrorKey(issue.message) ? issue.message : undefined;
}

function isZodCustomErrorKey(value: string): value is ZodCustomErrorKey {
  return value in zodCustomErrorMessages;
}

function getValueTypeLabel(locale: Locale, expected: string): string {
  const labels: Record<string, string> = valueTypeLabels[locale];
  return labels[expected] ?? labels.default;
}

function formatIssuePath(path: ZodIssue['path']): string {
  return path.map((segment) => String(segment)).join('.');
}
