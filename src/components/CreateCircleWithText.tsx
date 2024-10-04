import Konva from 'konva';

interface CircleWithText {
  circle: Konva.Circle;
  text: Konva.Text;
}

/**
 * Crée un cercle avec un texte associé et l'ajoute au layer spécifié.
 * @param layer Le layer sur lequel ajouter le cercle et le texte.
 * @param x La position x du cercle.
 * @param y La position y du cercle.
 * @returns Un objet contenant le cercle créé et le texte.
 */
const CreateCircleWithText = (
  layer: Konva.Layer,
  x: number,
  y: number
): CircleWithText => {
  const circle = new Konva.Circle({
    x: x,
    y: y,
    radius: 0,
    fill: '#34683F',
    stroke: 'black',
    strokeWidth: 1,
    draggable: true,
    name: 'draggable-circle',
  });

  const text = new Konva.Text({
    text: "OHM's AI",
    fontSize: 10,
    fontFamily: 'Calibri',
    fill: 'black',
    visible: false, // Par défaut, le texte est masqué
  });

  // Positionner le texte au centre du cercle
  const textWidth = text.width();
  const textHeight = text.height();
  text.x(circle.x() - textWidth / 2); // Centrer horizontalement
  text.y(circle.y() - textHeight / 2); // Centrer verticalement

  // Ajouter les événements de survol au cercle
  circle.on('mouseover', function (this: Konva.Circle) {
    this.fill('#F2F2F2');
    text.visible(true); // Rendre le texte visible
    layer.batchDraw(); // Dessiner le layer
    document.body.style.cursor = 'pointer';
  });

  circle.on('mouseout', function (this: Konva.Circle) {
    this.fill('#34683F');
    text.visible(false); // Masquer le texte
    layer.batchDraw(); // Dessiner le layer
    document.body.style.cursor = 'default';
  });

  // Mettre à jour la position du texte lors du déplacement du cercle
  circle.on('dragmove', () => {
    text.x(circle.x() - textWidth / 2); // Centrer horizontalement
    text.y(circle.y() - textHeight / 2); // Centrer verticalement
    layer.batchDraw(); // Redessiner le layer
  });

  // Ajouter le cercle et le texte au layer
  layer.add(circle);
  layer.add(text);

  const tween = new Konva.Tween({
    node: circle,
    duration: 0.5,
    radius: 24, // La taille finale
    easing: Konva.Easings.EaseInOut, // Type de transition
  });

  tween.play(); // Démarrer l'animation

  layer.batchDraw(); // Redessiner le layer

  return { circle, text }; // Retourner à la fois le cercle et le texte
};

export default CreateCircleWithText;
