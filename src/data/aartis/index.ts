import { AartiItem } from '@/types';
import { ganeshaAartis } from './ganesha';
import { shivaAartis } from './shiva';
import { deviAartis } from './devi';
import { vitthalAartis } from './vitthal';
import { ramaAartis } from './rama';
import { krishnaAartis } from './krishna';
import { dattatreyaAartis } from './dattatreya';
import { hanumanAartis } from './hanuman';
import { saintsAartis } from './saints';
import { nityapujaAartis } from './nityapuja';
import { navagrahaAartis } from './navagraha';

export const aartis: AartiItem[] = [
  ...ganeshaAartis,
  ...shivaAartis,
  ...deviAartis,
  ...vitthalAartis,
  ...ramaAartis,
  ...krishnaAartis,
  ...dattatreyaAartis,
  ...hanumanAartis,
  ...saintsAartis,
  ...nityapujaAartis,
  ...navagrahaAartis,
];

export {
  ganeshaAartis,
  shivaAartis,
  deviAartis,
  vitthalAartis,
  ramaAartis,
  krishnaAartis,
  dattatreyaAartis,
  hanumanAartis,
  saintsAartis,
  nityapujaAartis,
  navagrahaAartis,
};
