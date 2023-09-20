document.addEventListener('DOMContentLoaded', function () {
    // Sélectionnez l'élément de bannière
    const banner = document.querySelector('header');

    // Ajoutez un gestionnaire d'événements au bouton "Commencer"
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', function () {
        // Faites défiler la page jusqu'à la bannière avec un effet doux (smooth scroll)
        banner.scrollIntoView({ behavior: 'smooth' });
    });

    // Créer un objet de correspondance entre les abréviations de pays et les noms complets
    const countryMapping = {
        'US': 'États-Unis',
        'FR': 'France',
        'DE': 'Allemagne',
        'GB': 'Royaume-Uni',
        'CA': 'Canada',
        'AU': 'Australie',
        'IT': 'Italie',
        'ES': 'Espagne',
        'JP': 'Japon',
        'BR': 'Brésil',
        'NZ': 'Nouvelle-Zélande',
        'CN': 'Chine',
        'SE': 'Suède',
        'RU': 'Russie',
        'NL': 'Pays-Bas',
        'HK': 'Hong Kong',
        'NO': 'Norvège',
        'CZ': 'République tchèque',
        'BE': 'Belgique',
        'IE': 'Irlande',
        'KR': 'Corée du Sud',
        // Ajoutez d'autres correspondances pour les pays ici
    };

    // Charger le fichier JSON
    fetch('films.json')
        .then(response => response.json())
        .then(data => {
            const filmList = document.getElementById('film-list'); // Sélectionnez la liste HTML
            const selectYear = document.getElementById('select-year');
            const selectCountry = document.getElementById('select-country');
            const sortButton = document.getElementById('sort-button');

            // Créer une liste d'années uniques à partir des données JSON
            const uniqueYears = [...new Set(data.map(film => film.year))];
            uniqueYears.sort((a, b) => a - b);

            // Créer une liste de pays uniques à partir des données JSON
            const uniqueCountries = [...new Set(data.map(film => film.country))];

            // Ajouter une option "Tous" pour l'année
            const allYearOption = document.createElement('option');
            allYearOption.value = 'Tous';
            allYearOption.textContent = 'Tous';
            selectYear.appendChild(allYearOption);

            // Ajouter les années triées comme options
            uniqueYears.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                selectYear.appendChild(option);
            });

            // Ajouter une option "Tous" pour le pays
            const allCountryOption = document.createElement('option');
            allCountryOption.value = 'Tous';
            allCountryOption.textContent = 'Tous';
            selectCountry.appendChild(allCountryOption);

            // Ajouter les pays uniques comme options en utilisant les noms complets
            uniqueCountries.forEach(countryAbbreviation => {
                const option = document.createElement('option');
                option.value = countryAbbreviation;
                option.textContent = countryMapping[countryAbbreviation] || countryAbbreviation;
                selectCountry.appendChild(option);
            });

            // Gestionnaire d'événements pour le filtrage par année
            selectYear.addEventListener('change', () => {
                const selectedYear = selectYear.value;
                const selectedCountry = selectCountry.value;
                filtrerFilms(selectedYear, selectedCountry);
            });

            // Gestionnaire d'événements pour le filtrage par pays
            selectCountry.addEventListener('change', () => {
                const selectedYear = selectYear.value;
                const selectedCountry = selectCountry.value;
                filtrerFilms(selectedYear, selectedCountry);
            });
            

            // Gestionnaire d'événements pour le tri des films
            sortButton.addEventListener('click', () => {
                const selectedYear = selectYear.value;
                const selectedCountry = selectCountry.value;
                trierFilms(selectedYear, selectedCountry);
            });

            // Fonction de filtrage des films
            function filtrerFilms(annee, pays) {
                const filmItems = document.querySelectorAll('.film-item');
                filmItems.forEach(item => {
                    const filmAnnee = item.querySelector('p:nth-child(2)').textContent.split(':')[1].trim();
                    const filmPays = item.querySelector('p:nth-child(3)').textContent.split(':')[1].trim();
            
                    // Affichez les films correspondants aux critères de filtrage, cachez les autres
                    if ((annee === 'Tous' || filmAnnee === annee) && (pays === 'Tous' || filmPays === pays)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }

            // Fonction de tri des films
            function trierFilms(annee, pays) {
                const filmItems = Array.from(document.querySelectorAll('.film-item'));
                filmItems.sort((a, b) => {
                    const filmTitleA = a.querySelector('h2').textContent;
                    const filmTitleB = b.querySelector('h2').textContent;

                    if (annee === 'Tous' || pays === 'Tous') {
                        return filmTitleA.localeCompare(filmTitleB);
                    } else {
                        const filmAnneeA = a.querySelector('p:nth-child(2)').textContent.split(':')[1].trim();
                        const filmAnneeB = b.querySelector('p:nth-child(2)').textContent.split(':')[1].trim();
                        const filmPaysA = a.querySelector('p:nth-child(3)').textContent.split(':')[1].trim();
                        const filmPaysB = b.querySelector('p:nth-child(3)').textContent.split(':')[1].trim();

                        if (filmAnneeA === annee && filmAnneeB === annee) {
                            return filmTitleA.localeCompare(filmTitleB);
                        } else if (filmPaysA === pays && filmPaysB === pays) {
                            return filmTitleA.localeCompare(filmTitleB);
                        } else {
                            return 0;
                        }
                    }
                });

                // Réinsérer les films triés dans la liste
                filmItems.forEach(item => {
                    filmList.appendChild(item);
                });
            }

            // Fonction pour obtenir les noms des acteurs à partir de la liste d'acteurs
            function getActorsNames(actors) {
                const actorNames = actors.map(actor => `${actor.first_name} ${actor.last_name}`);
                return actorNames.join(', ');
            }

            // Parcourir les données JSON et afficher les films avec leurs détails
            data.forEach(film => {
                const filmElement = document.createElement('div');
                filmElement.classList.add('film-item');
                filmElement.innerHTML = `
                    <h2>${film.title}</h2>
                    <p><strong>Année:</strong> ${film.year}</p>
                    <p><strong>Pays:</strong> ${countryMapping[film.country] || film.country}</p>
                    <p><strong>Acteurs:</strong> ${getActorsNames(film.actors)}</p>
                    <p><strong>Description:</strong> ${film.summary}</p>
                `;

                // Ajouter l'élément de film à la liste
                filmList.appendChild(filmElement);
            });
        });
});
