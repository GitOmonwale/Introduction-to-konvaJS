import { useEffect, useRef } from 'preact/hooks';
import Konva from 'konva';
import createCircleWithText from './CreateCircleWithText';
import { KonvaEventObject } from 'konva/lib/Node';

const Konvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = new Konva.Stage({
      container: containerRef.current!,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    let lines: { line: Konva.Line; pointA: Konva.Circle; pointB: Konva.Circle }[] = [];
    let selectedPoints: Konva.Circle[] = [];

    // Écouteur pour créer un point au clic
    stage.on('click', (e: KonvaEventObject<MouseEvent>) => {
      if (e.target === stage) {
      
        const pointerPosition = stage.getPointerPosition();
        if (pointerPosition) {
          createPoint(pointerPosition.x, pointerPosition.y);
        }
      }
    });

    // Fonction pour créer un point
    function createPoint(x: number, y: number) {
      const { circle, text } = createCircleWithText(layer, x, y); // Utilisation de createCircleWithText

      // Met à jour les lignes lorsque le point est déplacé
      circle.on('dragmove', () => {
        updateLines(circle);
      });

      // Écouteur pour gérer la sélection des points
      circle.on('click', (event: KonvaEventObject<MouseEvent>) => {
        event.cancelBubble = true; // Empêche l'événement de clic de se propager à la scène
        selectedPoints.push(circle);
        if (selectedPoints.length === 2) {
          drawLine(selectedPoints[0], selectedPoints[1]);
          selectedPoints = []; // Réinitialise les points sélectionnés après la création de la ligne
        }
      });

      // Écouteur pour supprimer le point au double clic
      circle.on('dblclick', () => {
        // Supprime le cercle et le texte du layer
        circle.destroy();
        text.destroy(); // Supprime le texte associé
        // Met à jour les lignes associées
        updateLinesOnDelete(circle);
        layer.draw(); // Redessine le layer
      });
    }

    // Fonction pour dessiner une ligne entre deux points
    function drawLine(pointA: Konva.Circle, pointB: Konva.Circle) {
      const line = new Konva.Line({
        points: [pointA.x(), pointA.y(), pointB.x(), pointB.y()],
        stroke: 'black',
        strokeWidth: 2,
      });

      lines.push({ line, pointA, pointB });
      layer.add(line);
      layer.draw();
    }

    // Fonction pour mettre à jour les lignes lorsque les points sont déplacés
    function updateLines(movedPoint: Konva.Circle) {
      lines.forEach(({ line, pointA, pointB }) => {
        if (pointA === movedPoint || pointB === movedPoint) {
          line.points([pointA.x(), pointA.y(), pointB.x(), pointB.y()]);
        }
      });
      layer.draw();
    }

    // Fonction pour mettre à jour les lignes lors de la suppression d'un point
    function updateLinesOnDelete(deletedPoint: Konva.Circle) {
      lines.forEach(({ line, pointA, pointB }) => {
        if (pointA === deletedPoint || pointB === deletedPoint) {
          line.destroy(); // Supprime la ligne associée
        }
      });
      // Filtrer les lignes restantes
      lines = lines.filter(({ pointA, pointB }) => pointA !== deletedPoint && pointB !== deletedPoint);
    }

    return () => {
      stage.destroy(); // Nettoyage lorsque le composant est démonté
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Konvas;
