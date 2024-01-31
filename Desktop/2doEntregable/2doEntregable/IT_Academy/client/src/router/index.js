import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

import AddView from "../views/AddStudentView.vue";
import ProfileView from "../views/ProfileStudentView.vue";
import DeleteView from "../views/DelStudentView.vue";
import ListView from "../views/ListStudentView.vue";

import AddCourseView from "../views/AddCourseView.vue";
import ListCoursesView from "../views/ListCourseView.vue";
import ProfileCourseView from "../views/ProfileCourseView.vue";
import DeleteCourseView from "../views/DelCourseView.vue";

import AddTeacherView from "../views/AddTeacherView.vue";
import ProfileTeacherView from "../views/ProfileTeacherView.vue";
import DeleteTeacherView from "../views/DelTeacherView.vue";
import ListTeacherView from "../views/ListTeacherView.vue";

import AddTeacherInCourseView from "../views/AddTeacherInCourseView.vue";
import ProfileTeacherInCourseView from "../views/ProfileTeacherInCourseView.vue";
import DeleteTeacherInCourseView from "../views/DelTeacherInCourseView.vue";
import ListTeacherInCourseView from "../views/ListTeacherInCourseView.vue";

import AddStudentInCourseView from "../views/AddStudentInCourseView.vue";
import ProfileStudentInCourseView from "../views/ProfileStudentInCourseView.vue";
import DeleteStudentInCourseView from "../views/DelStudentInCourseView.vue";
import ListStudentInCourseView from "../views/ListStudentInCourseView.vue";

import ContactView from "../views/ContactView.vue";
import ListContactView from "../views/ListContactView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Inicio",
      component: HomeView,
    },
    {
      path: "/registerstudent",
      name: "RegisterStudent",
      component: AddView,
    },
    {
      path: "/profilestudentedit/:id/:ed",
      name: "ProfileStudentEdit",
      component: ProfileView,
    },
    {
      path: "/profilestudentupdate/:id/:ed",
      name: "ProfileStudentUpdate",
      component: ProfileView,
    },
    {
      path: "/profilestudentdelete/:id",
      name: "ProfileStudentDelete",
      component: DeleteView,
    },
    {
      path: "/liststudents",
      name: "ListStudents",
      component: ListView,
    },
    //Cursos:
    {
      path: "/registroCurso",
      name: "RegistroCurso",
      component: AddCourseView,
    },
    {
      path: "/profilecourseupdate/:id/:ed",
      name: "ProfileCourseUpdate",
      component: ProfileCourseView,
    },
    {
      path: "/profilecoursedelete/:id",
      name: "ProfileCourseDelete",
      component: DeleteCourseView,
    },
    {
      path: "/listCourses",
      name: "ListCourses",
      component: ListCoursesView,
    },
    //Profesores:
    {
      path: "/registroProfesor",
      name: "RegistroProfesor",
      component: AddTeacherView,
    },
    {
      path: "/profileteacheredit/:id/:ed",
      name: "ProfileTeacherEdit",
      component: ProfileTeacherView,
    },
    {
      path: "/profileteacherupdate/:id/:ed",
      name: "ProfileTeacherUpdate",
      component: ProfileTeacherView,
    },
    {
      path: "/profileteacherdelete/:id",
      name: "ProfileTeacherDelete",
      component: DeleteTeacherView,
    },
    {
      path: "/listteachers",
      name: "ListTeachers",
      component: ListTeacherView,
    },
    //Profesor asignado a curso:
    {
      path: "/profesorporcurso",
      name: "ProfesorPorCurso",
      component: AddTeacherInCourseView,
    },
    {
      path: "/profileticedit/:id/:ed",
      name: "ProfileTicEdit",
      component: ProfileTeacherInCourseView,
    },
    {
      path: "/profileticupdate/:id/:ed",
      name: "ProfileTicUpdate",
      component: ProfileTeacherInCourseView,
    },
    {
      path: "/profileticdelete/:id",
      name: "ProfileTicDelete",
      component: DeleteTeacherInCourseView,
    },
    {
      path: "/listprofesorporcurso",
      name: "ListProfesorPorCurso",
      component: ListTeacherInCourseView,
    },
    //Estudiantes asignado a curso:
    {
      path: "/estudianteporcurso",
      name: "EstudiantePorCurso",
      component: AddStudentInCourseView,
    },
    {
      path: "/profilesicedit/:id/:ed",
      name: "ProfileSicEdit",
      component: ProfileStudentInCourseView,
    },
    {
      path: "/profilesicupdate/:id/:ed",
      name: "ProfileSicUpdate",
      component: ProfileStudentInCourseView,
    },
    {
      path: "/profilesicdelete/:id",
      name: "ProfileSicDelete",
      component: DeleteStudentInCourseView,
    },  
    {
      path: "/listestudiantesporcurso",
      name: "ListEstudiantesPorCurso",
      component: ListStudentInCourseView,
    },
    //Contacto:
    {
      path: "/contact",
      name: "Contact",
      component: ContactView,
    },  
    {
      path: "/listContact",
      name: "ListContact",
      component: ListContactView,
    },
  ],
});

export default router;