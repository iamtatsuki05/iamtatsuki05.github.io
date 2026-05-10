import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { formatZodError, formatZodIssue, safeParseLocalized, zodCustomError } from '@/lib/validation/zodI18n';

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  age: z.number().min(18).max(65),
});

describe('zodI18n', () => {
  it('formats required, type, length, range, and email errors in Japanese by default', () => {
    const required = profileSchema.safeParse({});
    expect(required.success).toBe(false);
    if (!required.success) {
      const error = formatZodError(required.error);
      expect(error.fieldErrors.name?.[0].message).toBe('必須項目です');
      expect(error.fieldErrors.email?.[0].message).toBe('必須項目です');
      expect(error.fieldErrors.age?.[0].message).toBe('必須項目です');
    }

    const invalid = profileSchema.safeParse({ name: 'a', email: 'not-email', age: 17 });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      const error = formatZodError(invalid.error);
      expect(error.fieldErrors.name?.[0].message).toBe('2文字以上で入力してください');
      expect(error.fieldErrors.email?.[0].message).toBe('メールアドレスの形式で入力してください');
      expect(error.fieldErrors.age?.[0].message).toBe('18以上で入力してください');
    }

    const invalidType = profileSchema.safeParse({ name: 1, email: 'user@example.com', age: 'old' });
    expect(invalidType.success).toBe(false);
    if (!invalidType.success) {
      const error = formatZodError(invalidType.error);
      expect(error.fieldErrors.name?.[0].message).toBe('文字列で入力してください');
      expect(error.fieldErrors.age?.[0].message).toBe('数値で入力してください');
    }
  });

  it('formats the same issues in English when locale is en', () => {
    const invalid = profileSchema.safeParse({ name: 'a', email: 'not-email', age: 66 });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      const error = formatZodError(invalid.error, 'en');
      expect(error.fieldErrors.name?.[0].message).toBe('Enter at least 2 characters');
      expect(error.fieldErrors.email?.[0].message).toBe('Enter a valid email address');
      expect(error.fieldErrors.age?.[0].message).toBe('Enter 65 or less');
    }
  });

  it('formats custom errors from typed translation keys', () => {
    const schema = z.object({
      slug: z.string().refine((value) => value === value.toLowerCase(), zodCustomError('validation.custom.slugLowercase')),
    });

    const invalid = schema.safeParse({ slug: 'Hello' });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(formatZodIssue(invalid.error.issues[0])).toBe('半角英小文字、数字、ハイフンで入力してください');
      expect(formatZodIssue(invalid.error.issues[0], 'en')).toBe('Use lowercase letters, numbers, and hyphens');
    }
  });

  it('preserves typed data on localized safeParse success and returns localized errors on failure', () => {
    const valid = safeParseLocalized(profileSchema, { name: 'Tatsuki', email: 'user@example.com', age: 20 }, 'en');
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.age).toBe(20);
    }

    const invalid = safeParseLocalized(profileSchema, { name: 'Tatsuki', email: 'invalid', age: 20 }, 'en');
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.fieldErrors.email?.[0].message).toBe('Enter a valid email address');
    }
  });
});
