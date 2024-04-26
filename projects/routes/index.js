//uvodimo potrebne module

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ProjectModel = require("../model/project");
const app = require("../app");
var db = require("../model/db");

//definiranje rute za prikaz svih projekata
//pronalazi sve projekte u bazi pomoću ProjectModel.find()
router.get("/", async (req, res, next) => {
  try {
    const projects = await ProjectModel.find();
    res.render("index", { projects: projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Error fetching projects");
  }
});

//definiranje rute za dodavanje novog projekta
//koristi se HTTP GET metoda za prikaz obrasca za unos podataka o novom projektu, te HTTP POST metoda za obradu podataka o novom projektu poslanom s obrasca
// izvlače se podaci o projektu kao što su ime, opis, cijena itd.
//stvara se nova instanca ProjectModel s tim podacima, a novi projekt se sprema u bazu podataka pomoću metode save()
router.get("/add-project", (req, res) => {
  res.render("add-project");
});

router.post("/add-project", async (req, res) => {
  try {
    const { name, description, price, completed_jobs, start_date, end_date } =
      req.body;

    const project = new ProjectModel({
      name,
      description,
      price,
      completed_jobs,
      start_date,
      end_date,
    });

    await project.save();

    console.log("Document saved to database...");
    res.redirect("/");
  } catch (error) {
    console.error("Error saving document...", error);
    res.status(500).send("Internal Server Error");
  }
});

//definiranje rute za uređivanje postojećeg projekta
//koristi se HTTP GET metoda za prikaz obrasca za uređivanje podataka o projektu, te HTTP POST metoda za obradu podataka o uređivanju projekta
router.get("/edit-project/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await ProjectModel.findById(projectId);
    var start_date = project.start_date.toISOString();
    start_date = start_date.substring(0, start_date.indexOf("T"));
    var end_date = project.end_date.toISOString();
    end_date = end_date.substring(0, end_date.indexOf("T"));

    if (!project) {
      return res.status(404).send("Project not found");
    }
    res.render("edit-project", {
      start_date: start_date,
      end_date: end_date,
      project: project,
    });
  } catch (error) {
    console.error("Error fetching project for edit:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/edit-project/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { name, description, price, completed_jobs, start_date, end_date } =
      req.body;

    await ProjectModel.findByIdAndUpdate(projectId, {
      name,
      description,
      price,
      completed_jobs,
      start_date,
      end_date,
    });

    res.redirect("/");
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).send("Internal Server Error");
  }
});

//koristi se HTTP POST metoda za brisanje projekta
//iz parametara rute dohvaća se ID projekta koji se želi izbrisati
//koristi se findByIdAndDelete() metoda za brisanje projekta s tim ID-om iz baze podataka
router.post("/delete-project/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    await ProjectModel.findByIdAndDelete(projectId);

    res.redirect("/");
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).send("Internal Server Error");
  }
});

//definiranje rute za dodavanje novog člana tima u projekt
//koristi se HTTP GET metoda za prikaz obrasca za unos novog člana tima, te HTTP POST metoda za obradu podataka o novom članu tima poslanom s obrasca
//iz parametara rute dohvaća se ID projekta kojem se želi dodati član tima
//dohvaća se projekt iz baze podataka, a novi član tima dodaje se u listu članova projekta
router.get("/add-team-member/:id", async function (req, res) {
  try {
    const project = await ProjectModel.findById(req.params.id);
    res.render("add-team-member", {
      title: "Add team member",
      project: project,
    });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).send("Error fetching project team member");
  }
});

router.post("/add-team-member/:id", async (req, res) => {
  var projectId = req.params.id;
  var user = req.body.user;

  try {
    const project = await ProjectModel.findById(projectId);

    project.members.push(user);

    await project.save();

    console.log("Team member added successfully to project", project);
    res.redirect("/");
  } catch (err) {
    console.error("Error adding new team member:", err);
    res.status(500).send("Error adding new team member");
  }
});

module.exports = router;
