import './style.css'
import toys from './data/toys.json'
import workplace from './data/workplace.json'
import feminicide from './data/feminicide.json'

import { initSportChart } from './section/sport.js';
initSportChart();
/**
 * main.js — Porte d'entrée du projet "La vie de Carole"
 * Vanilla JS pur — pas de bundler, pas de modules
 * Charge dynamiquement chaque section dans l'ordre
 */

import initToys from './section/toys.js'
 
initToys()
