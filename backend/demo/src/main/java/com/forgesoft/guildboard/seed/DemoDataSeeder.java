package com.forgesoft.guildboard.seed;

import com.forgesoft.guildboard.dto.AssignmentCreateRequest;
import com.forgesoft.guildboard.dto.QuestCreateRequest;
import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.entity.CharacterClass;
import com.forgesoft.guildboard.entity.Difficulty;
import com.forgesoft.guildboard.repository.AdventurerRepository;
import com.forgesoft.guildboard.repository.QuestRepository;
import com.forgesoft.guildboard.service.AdventurerService;
import com.forgesoft.guildboard.service.QuestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnProperty(name = "guildboard.demo-data.enabled", havingValue = "true")
public class DemoDataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final AdventurerRepository adventurerRepository;
    private final QuestRepository questRepository;
    private final AdventurerService adventurerService;
    private final QuestService questService;

    public DemoDataSeeder(AdventurerRepository adventurerRepository,
                          QuestRepository questRepository,
                          AdventurerService adventurerService,
                          QuestService questService) {
        this.adventurerRepository = adventurerRepository;
        this.questRepository = questRepository;
        this.adventurerService = adventurerService;
        this.questService = questService;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (adventurerRepository.count() > 0 || questRepository.count() > 0) {
            log.info("Demo data skipped: the database already contains data.");
            return;
        }

        // Veterans are created directly at their level; everything else goes through the services so RG1-RG3 apply
        adventurer("Grimbold le Prudent", CharacterClass.WARRIOR, 5, 120, 340);
        adventurer("Elyra Lune-d'Argent", CharacterClass.MAGE, 7, 380, 520);
        Adventurer thorin = adventurer("Thorin Barbe-de-Fer", CharacterClass.WARRIOR, 3, 90, 150);
        Adventurer sylvaine = adventurer("Sylvaine des Bois", CharacterClass.RANGER, 6, 210, 410);
        Adventurer aldric = adventurer("Frère Aldric", CharacterClass.CLERIC, 4, 50, 220);
        Adventurer maelis = adventurer("Maëlis l'Éclaireuse", CharacterClass.RANGER, 2, 40, 60);
        Adventurer oswin = adventurer("Oswin le Sage", CharacterClass.MAGE, 9, 700, 1250);
        Adventurer brunhilde = adventurer("Brunhilde Cœur-Vaillant", CharacterClass.WARRIOR, 8, 450, 980);
        Adventurer isaure = adventurer("Sœur Isaure", CharacterClass.CLERIC, 1, 0, 0);
        adventurer("Kael Ombrelame", CharacterClass.RANGER, 10, 150, 1600);
        Adventurer vorgan = adventurer("Vorgan le Traître", CharacterClass.WARRIOR, 3, 60, 90);
        Adventurer mirelda = adventurer("Mirelda la Fourbe", CharacterClass.MAGE, 2, 30, 45);

        quest("Nettoyer la cave aux gobelins",
                "Une bande de gobelins a pris possession de la cave de l'auberge du Sanglier Borgne. Délogez-les.",
                Difficulty.EASY, 1, 40, 60);
        quest("Escorter la caravane du nord",
                "Protégez un marchand et sa caravane sur la route du nord, infestée de bandits.",
                Difficulty.MEDIUM, 3, 120, 150);
        quest("Négocier avec le dragon comptable",
                "Un dragon réclame des impôts arriérés au village. Trouvez un accord sans finir en cendres.",
                Difficulty.EPIC, 9, 900, 800);
        quest("Cueillir des herbes de lune",
                "L'apothicaire a besoin d'herbes qui ne poussent qu'à la pleine lune, au bord du lac.",
                Difficulty.EASY, 1, 20, 40);
        quest("Chasser la bête du marais",
                "Une créature dévore le bétail des fermes voisines du marais. Mettez fin à ses ravages.",
                Difficulty.HARD, 6, 300, 350);
        quest("Retrouver le grimoire perdu",
                "Un grimoire interdit a disparu de la bibliothèque de la guilde. Retrouvez-le avant qu'il ne serve.",
                Difficulty.MEDIUM, 4, 150, 200);
        quest("Défendre le pont de Valmor",
                "Une armée d'orcs marche sur le pont de Valmor. Tenez la position jusqu'à l'arrivée des renforts.",
                Difficulty.HARD, 7, 400, 450);

        startQuest("Explorer les ruines d'Ashkar",
                "Des ruines oubliées ont refait surface après la tempête. Cartographiez-les et rapportez leurs secrets.",
                Difficulty.HARD, 5, 280, 320, sylvaine);
        startQuest("Livrer un message au roi",
                "Portez une lettre scellée au château royal sans vous faire intercepter en chemin.",
                Difficulty.EASY, 1, 30, 50, maelis);
        startQuest("Protéger le temple de l'aube",
                "Des pillards rôdent autour du temple de l'aube. Veillez sur les prêtres jusqu'à la prochaine lune.",
                Difficulty.MEDIUM, 3, 110, 140, aldric);
        startQuest("Traquer la liche de Morneval",
                "Une liche lève une armée de morts dans les cryptes de Morneval. Détruisez son phylactère.",
                Difficulty.EPIC, 8, 1000, 900, oswin);

        completeQuest("Chasse aux loups de la forêt sombre",
                "Une meute de loups géants attaque les voyageurs de la forêt sombre. Éliminez la meute.",
                Difficulty.MEDIUM, 2, 100, 130, thorin);
        completeQuest("Réparer la palissade du village",
                "La palissade du village a cédé pendant l'orage. Aidez les habitants à la reconstruire.",
                Difficulty.EASY, 1, 25, 60, isaure);
        completeQuest("Vaincre le géant des collines",
                "Un géant bloque le col des collines et rançonne les caravanes. Faites-le déguerpir.",
                Difficulty.HARD, 5, 350, 400, brunhilde);
        completeQuest("Voler le calice du baron",
                "Le baron de Cendremont cache un calice volé à la guilde. Récupérez-le discrètement.",
                Difficulty.MEDIUM, 2, 120, 110, vorgan);

        adventurerService.ban(vorgan.getId());
        adventurerService.ban(mirelda.getId());

        log.info("Demo data loaded: {} adventurers (2 banned) and {} quests.",
                adventurerRepository.count(), questRepository.count());
    }

    private Adventurer adventurer(String name, CharacterClass characterClass, int level, int xp, int gold) {
        Adventurer adventurer = new Adventurer(name, characterClass);
        adventurer.setLevel(level);
        adventurer.setXp(xp);
        adventurer.setGold(gold);
        return adventurerRepository.save(adventurer);
    }

    private Long quest(String title, String description, Difficulty difficulty,
                       int requiredLevel, int goldReward, int xpReward) {
        QuestCreateRequest request = new QuestCreateRequest(title, description, difficulty, requiredLevel, goldReward, xpReward);
        return questService.create(request).id();
    }

    private Long startQuest(String title, String description, Difficulty difficulty,
                            int requiredLevel, int goldReward, int xpReward, Adventurer adventurer) {
        Long questId = quest(title, description, difficulty, requiredLevel, goldReward, xpReward);
        questService.assign(questId, new AssignmentCreateRequest(adventurer.getId()));
        return questId;
    }

    private void completeQuest(String title, String description, Difficulty difficulty,
                               int requiredLevel, int goldReward, int xpReward, Adventurer adventurer) {
        Long questId = startQuest(title, description, difficulty, requiredLevel, goldReward, xpReward, adventurer);
        questService.complete(questId);
    }
}
