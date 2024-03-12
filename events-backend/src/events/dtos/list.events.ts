export enum EventWhenEnum {
  ALL = 1,
  TODAY = 2,
  TOMORROW = 3,
  THIS_WEEK = 4,
  NEXT_WEEK = 5,
  NEXT_MONTH = 6,
}

export class ListEvents {
  when?: EventWhenEnum = EventWhenEnum.ALL;
  page: number = 1;
}
