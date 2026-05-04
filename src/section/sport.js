import data from '../data/sport.json';
import * as d3 from 'd3';

const container = document.getElementById('leSport');
// Données qu'on va visualiser
// Ici : les résultats par question (accord / pas accord / neutre)
const questions = data.resultats_detailles_par_question;
   // Fonction principale qui dessine le graphique
   export function initSportChart() {
      if (!container) return;
      // Dimensions
      const width = 700;
      const height = 400;
      const margin = { top: 40, right: 30, bottom: 60, left: 200 };
      // Créer le SVG dans le conteneur
      const svg = d3.select('#leSport')
         .append('svg')
         .attr('width', width)
         .attr('height', height);
      // Préparer les données : ne garder que les questions avec une ventilation régionale
      const dataset = questions
         .map(q => {
            const accord = q.ventilation_sociodemographique?.region
               ?.find(r => r.groupe === 'Île-de-France')
               ?.accord_pct;
            return {
               label: q.enonce.substring(0, 50) + '...', // texte court
               accord: typeof accord === 'number' ? accord : null
            };
         })
         .filter(d => d.accord !== null);
      // Échelles D3
      const x = d3.scaleLinear().domain([0, 100]).range([margin.left, width -
         margin.right]);
      const y = d3.scaleBand()
         .domain(dataset.map(d => d.label))
         .range([margin.top, height - margin.bottom])
         .padding(0.2);
      // Barres
      svg.selectAll('rect')
         .data(dataset)
         .enter().append('rect')
         .attr('x', margin.left)
         .attr('y', d => y(d.label))
         .attr('width', d => x(d.accord) - margin.left)
         .attr('height', y.bandwidth())
         .attr('fill', '#e63946');
      // Axes
      svg.append('g').attr('transform', `translate(0,${height -
         margin.bottom})`).call(d3.axisBottom(x));
      svg.append('g').attr('transform',
         `translate(${margin.left},0)`).call(d3.axisLeft(y));
   }
  
