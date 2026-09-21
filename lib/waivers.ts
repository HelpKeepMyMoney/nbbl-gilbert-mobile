export interface WaiverForm {
  id: string;
  title: string;
  href: string;
}

export const WAIVER_FORMS: WaiverForm[] = [
  {
    id: "qqjwuvczszqltachbpia2",
    title: "Consent for Minor Athlete Participation",
    href: "https://waiver.smartwaiver.com/w/qqjwuvczszqltachbpia2/web/",
  },
  {
    id: "ctpkadpmynwsfthiyjtgii",
    title: "Minor Athlete Media, Likeness & Content Release",
    href: "https://waiver.smartwaiver.com/w/ctpkadpmynwsfthiyjtgii/web/",
  },
];

export const SMARTWAIVER_WIDGET_SRC =
  "https://app.smartwaiver.com/webpl/f.js?webpl_waiver=splashpage-195553&webpl_title=Sign%20waivers%20for%20student%20athletes&webpl_align=Right&webpl_fontsize=20&webpl_background=%23f21d2f&webpl_fontcolor=%23FFFFFF&webpl_font=Verdana";
