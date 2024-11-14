# Architecture

![eShopOnContainers Architecture](architectuur.png)

## Browser

Gebruiker en Redacteur kunnen toegang krijgen tot de applicatie via de Browser.

## Front-end

Gebruikers en redacteurs kunnen interactie hebben met de applicatie

## API Gateway

Beheert de communicatie tussen de front-end en de backend services. Het is een toegangspunt voor alle aanvragen die naar de backend services worden gestuurd.

## PostService

- Redacteurs kunnen posts aanmaken, opslaan als concept, bewerken en publiceren. (US1,2,3)
- Gebruiker kan een overzicht van gepubliceerde posts zien. (US4)
- Posts filteren (US5)
- Postgegevens worden opgeslagen in MySQL database en communiceert met ReviewService op een synchrone manier. ReviewService maakt gebruik van synchrone communicatie met PostService om de status van een post op te halen of bij te werken.
- Stuurt meldingen over nieuwe posts naar de Message Service om andere services zoals ReviewService en CommentService op de hoogte te houden (bijv. goedkeuring, afwijzing, nieuwe reacties). (asynchroon)

## ReviewService

- Redacteurs kunnen posts bekijken, goedkeuren of afwijzen. (US7)
- Wanneer een post wordt goedgekeurd of afgewezen, stuurt de ReviewService een melding naar de Message Service om de redacteur op de hoogte te brengen (asynchrone). (US8)
- Gebruikt PostService om de status van een post op te halen of bij te werken. (synchrone)
- Redacteurs kunnen opmerkingen toevoegen bij afwijzing van een post. Het wordt naar Message Service verstuurd en het kan later opgehaald worden door PostService. (asynchroon) (US9)

## CommentService

- Gebruikers kunnen een reactie plaatsen en reacties van andere collega’s lezen. (US10,11)
- Gebruikers kunnen hun eigen reacties bewerken of verwijderen. (US12)
- Communiceert met de PostService voor informatie over posts en gebruikt een eigen MySQL database voor het opslaan van reacties. (synchroon)
- Gebruikt Message Service voor notificaties, bijvoorbeeld als er een nieuwe reactie wordt geplaatst. PostService ontvangt deze melding.(asynchrone)

## Message Service

Behandelt berichten via RabbitMQ en Kafka voor notificaties en updates. (asynchroon)

## Eureka

Wordt gebruikt als een service registry waar alle microservices zich registreren, zodat ze elkaar kunnen vinden en met elkaar kunnen communiceren.

## Config Server

Beheert de configuraties van alle services op een centrale plek. Het is handig voor het beheren van configuratiewijzigingen.
