export interface MailRoutes {
  userRole: 'USER' | 'SENDER';
  routes: { name: string; routerLink: string; icon: string }[];
}
