import { GoogleProfile } from '../google.provider';
import { YandexProfile } from '../yandex.provider';

export type BaseProfile = GoogleProfile | YandexProfile;
