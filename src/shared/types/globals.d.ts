export type OmitTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'>;
export type OmitId<T> = Omit<T, 'id'>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type WithLocaleParams<T = {}> = {
  params: Promise<{ locale: Locale } & T>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};
