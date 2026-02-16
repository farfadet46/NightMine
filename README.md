# 🌙 NightMine v0.3 - Mise à jour Sauvegarde

## 🎮 Nouvelles Fonctionnalités

### 💾 Système de Sauvegarde Automatique
- **Sauvegarde automatique** toutes les 30 secondes dans le localStorage du navigateur
- Première sauvegarde après 5 secondes de jeu
- Conservation de l'état complet du jeu :
  - Position du joueur
  - Inventaire complet
  - Monde modifié (tous les blocs placés/cassés)
  - Coffres et fourneaux
  - Items au sol
  - Seed du monde

### 📥📤 Import / Export de Sauvegarde
Dans le menu pause (touche Échap), vous pouvez maintenant :
- **Exporter** votre sauvegarde en fichier JSON
- **Importer** une sauvegarde depuis un fichier JSON
- **Supprimer** la sauvegarde actuelle
- Voir la date de dernière sauvegarde

### 🎮 Nouvelle Partie
- Bouton pour démarrer une nouvelle partie
- Supprime automatiquement la sauvegarde existante

## 🎯 Utilisation

### Menu Pause (Échap)
Le menu pause a été amélioré avec :

1. **Section Sauvegarde** :
   - Affichage de la date de dernière sauvegarde
   - Bouton "Exporter" : télécharge un fichier .json de votre partie
   - Bouton "Importer" : charge une sauvegarde depuis un fichier
   - Bouton "Supprimer" : efface la sauvegarde locale

2. **Section Monde** :
   - Configuration du seed (comme avant)
   - Génération aléatoire

3. **Actions** :
   - Nouvelle Partie : recommence à zéro
   - Reprendre : retour au jeu

### Sauvegarde Automatique
- Votre progression est sauvegardée automatiquement
- Aucune action requise de votre part
- Les notifications s'affichent en haut à gauche

## 📋 Détails Techniques

### Format de Sauvegarde
```json
{
  "version": "0.3",
  "timestamp": 1234567890,
  "seed": 123456,
  "player": { "x": 10, "y": 20, "vx": 0, "vy": 0 },
  "inventory": { "slots": [...], "selectedSlot": 0 },
  "world": {
    "saplings": [],
    "droppedItems": [],
    "furnaces": {},
    "chests": {}
  },
  "chunks": {
    "0": { "blocks": [...], "width": 16, "height": 64, "modified": true }
  }
}
```

### Stockage
- **LocalStorage** : clé `nightmine_save_v03`
- **Limite** : ~5-10 MB selon le navigateur
- **Persistance** : survit à la fermeture du navigateur

### Compatibilité
- Fonctionne avec tous les navigateurs modernes
- Compatible avec les mods existants
- Les sauvegardes sont liées au domaine/origine du site

## 🔧 Améliorations Futures Possibles
- Sauvegarde dans le cloud
- Multiples slots de sauvegarde
- Sauvegarde automatique avant la fermeture du navigateur
- Compression des données de sauvegarde
- Backup automatique

## 📝 Notes de Version

### v0.3 (Actuel)
- ✅ Sauvegarde automatique en localStorage
- ✅ Import/Export de sauvegarde
- ✅ Menu pause amélioré
- ✅ Notification de sauvegarde
- ✅ Système de nouvelle partie

### v0.22 (Précédent)
- Système de mods
- Crafting
- Fourneaux et coffres
- Outils en bois et fer

## 🐛 Dépannage

### La sauvegarde ne fonctionne pas
1. Vérifiez que le localStorage n'est pas désactivé
2. Vérifiez l'espace disponible (console navigateur)
3. Essayez d'exporter puis réimporter la sauvegarde

### Perte de sauvegarde
- Si vous videz le cache du navigateur, la sauvegarde sera perdue
- Pensez à exporter régulièrement vos sauvegardes importantes

### Import échoue
- Vérifiez que le fichier est bien au format JSON valide
- Assurez-vous que c'est une sauvegarde NightMine (v0.3)

## 🎮 Commandes

- **ZQSD / Flèches** : Déplacement
- **Espace** : Sauter
- **Clic gauche** : Miner (maintenir)
- **Clic droit** : Placer bloc / Interagir
- **E** : Inventaire / Crafting
- **1-9** : Sélection barre d'action
- **Échap** : Menu pause

---

Bon jeu ! 🌙⛏️
