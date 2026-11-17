# Bitwise

Le binaire sous tous ses angles : un nombre écrit dans toutes les bases à la fois, chaque bit cliquable, les opérations bit à bit posées en colonnes et expliquées, le texte en octets, la table ASCII et les nombres à virgule décortiqués.

*English version: [README.en.md](README.en.md)*

![Bitwise](screenshots/1.jpg)

## Version téléphone

- Chaque champ (décimal, hexadécimal, binaire…) a son étiquette au-dessus et prend toute la largeur.
- Les bits se touchent du doigt, huit par ligne ; la table ASCII tient sur deux colonnes (touche un caractère pour l'ouvrir dans Nombre).
- Les mêmes réglages que sur PC (même identifiant `neodex.bitwise`).

## Nombre

- Tape dans **n'importe quel champ** (décimal, hexadécimal, binaire, octal ou caractères) : les autres suivent pendant que tu tapes. Les préfixes `0x`, `0b` et `0o` marchent partout, les espaces et `_` sont ignorés.
- **Largeur** : 8, 16, 32 ou 64 bits. **Signé** lit le bit de gauche comme un signe moins (complément à deux), et `-1` devient `1111…1`.
- **Les bits** : un clic allume ou éteint un bit ; chaque case montre son numéro, l'infobulle sa valeur.
- **Actions rapides** : NOT, décalages, rotations, opposé, inversion de l'ordre des octets (petit / grand boutiste), tout à 0, tout à 1.
- **Infos** : nombre de bits à 1, bit le plus haut, puissance de 2, parité, valeur signée et non signée, plage de la largeur choisie.

## Opérations

A et B (en décimal, `0x…`, `0b…` ou en binaire long), puis AND, OR, XOR, NAND, NOR, XNOR, `<<`, `>>`, `>>>`, ROL, ROR, +, − et ×. Les deux nombres et le résultat s'alignent bit sous bit, avec une phrase qui explique l'opération. **Résultat → A** enchaîne les calculs.

## Texte

Un texte devient ses octets UTF-8 en hexadécimal, binaire, décimal ou Base64 (avec le nombre de caractères et d'octets : « é » prend 2 octets). Dans l'autre sens, colle des octets pour retrouver le texte.

## Table ASCII

Les 128 caractères avec leur code en décimal, hexadécimal et binaire, et le nom des caractères de contrôle (NUL, TAB, LF…). Un clic l'ouvre dans **Nombre**.

## Virgule flottante

Un nombre en `float` (32 bits) ou `double` (64 bits) : le signe, l'exposant et la mantisse en couleurs, la formule, la valeur vraiment stockée (on y voit pourquoi 0,1 n'est jamais exact) et les cas spéciaux (zéro, infini, NaN, dénormalisés). Les bits sont cliquables ici aussi.

## Données

Les derniers nombres, le texte et l'onglet ouvert sont gardés dans le dossier du plugin. Autorisation : `storage` seulement.

## Version 1.1.0

- Textes et bits cliquables plus grands ; l'appli prend toute la largeur (32 bits sur une ligne).
- **Masques prêts à l'emploi** (onglet Nombre) : allumer, éteindre, basculer ou tester le bit n, garder les n bits du bas. Chaque masque montre le calcul (x, le masque, le résultat) et explique pourquoi il marche.
- **Les bits qui glissent** (onglet Opérations) : pour <<, >>, >>>, ROL et ROR, le bouton « Voir les bits glisser » montre le décalage case par case.
