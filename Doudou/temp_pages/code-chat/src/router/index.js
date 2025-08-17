import { createRouter, createWebHistory } from 'vue-router';
import Frame_2120455096 from '../pages/Frame_2120455096/Frame_2120455096.vue';

const routes = [
  {
    path: '/',
    name: 'Frame_2120455096',
    component: Frame_2120455096,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;