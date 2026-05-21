package me.storyfor.backend.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class IllustrationService {

    private static final Map<String, List<String>> THEME_ILLUSTRATIONS = Map.ofEntries(
        Map.entry("adventure", List.of("/illustrations/forest/forest_day.webp", "/illustrations/forest/forest_path.webp", "/illustrations/forest/forest_night.webp", "/illustrations/forest/forest_cozy.webp")),
        Map.entry("friendship", List.of("/illustrations/meadow/meadow_flowers.webp", "/illustrations/meadow/meadow_animals.webp", "/illustrations/meadow/meadow_tree.webp", "/illustrations/meadow/meadow_stars.webp")),
        Map.entry("courage", List.of("/illustrations/castle/castle_gate.webp", "/illustrations/castle/castle_room.webp", "/illustrations/castle/castle_garden.webp", "/illustrations/castle/castle_bed.webp")),
        Map.entry("nature", List.of("/illustrations/meadow/meadow_flowers.webp", "/illustrations/forest/forest_path.webp", "/illustrations/meadow/meadow_animals.webp", "/illustrations/meadow/meadow_stars.webp")),
        Map.entry("space", List.of("/illustrations/space/space_stars.webp", "/illustrations/space/space_planet.webp", "/illustrations/space/space_ship.webp", "/illustrations/space/space_sleep.webp")),
        Map.entry("ocean", List.of("/illustrations/ocean/ocean_surface.webp", "/illustrations/ocean/ocean_deep.webp", "/illustrations/ocean/ocean_beach.webp", "/illustrations/ocean/ocean_sunset.webp")),
        Map.entry("magic", List.of("/illustrations/castle/castle_gate.webp", "/illustrations/castle/castle_room.webp", "/illustrations/forest/forest_night.webp", "/illustrations/castle/castle_bed.webp")),
        Map.entry("helping", List.of("/illustrations/meadow/meadow_flowers.webp", "/illustrations/meadow/meadow_animals.webp", "/illustrations/forest/forest_path.webp", "/illustrations/meadow/meadow_stars.webp"))
    );

    private static final Map<String, String> THEME_TO_ILLUSTRATION_THEME = Map.of(
        "adventure", "forest", "friendship", "meadow", "courage", "castle",
        "nature", "meadow", "space", "space", "ocean", "ocean",
        "magic", "castle", "helping", "meadow"
    );

    public List<String> getIllustrations(String storyTheme, boolean isPro) {
        String theme = storyTheme != null ? storyTheme.toLowerCase() : "adventure";
        List<String> illustrations = THEME_ILLUSTRATIONS.getOrDefault(theme, THEME_ILLUSTRATIONS.get("adventure"));
        return isPro ? illustrations : List.of(illustrations.get(0));
    }

    public String getIllustrationTheme(String storyTheme) {
        String theme = storyTheme != null ? storyTheme.toLowerCase() : "adventure";
        return THEME_TO_ILLUSTRATION_THEME.getOrDefault(theme, "forest");
    }
}
