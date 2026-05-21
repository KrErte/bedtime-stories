package me.storyfor.backend.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class IllustrationService {

    // Picsum Photos - no auth, no referrer issues, reliable CDN
    private static final Map<String, List<String>> THEME_ILLUSTRATIONS = Map.ofEntries(
        Map.entry("adventure",  List.of(
            "https://picsum.photos/seed/forest1/800/500",
            "https://picsum.photos/seed/forest2/800/500",
            "https://picsum.photos/seed/forest3/800/500",
            "https://picsum.photos/seed/forest4/800/500"
        )),
        Map.entry("friendship", List.of(
            "https://picsum.photos/seed/meadow1/800/500",
            "https://picsum.photos/seed/meadow2/800/500",
            "https://picsum.photos/seed/meadow3/800/500",
            "https://picsum.photos/seed/meadow4/800/500"
        )),
        Map.entry("courage",    List.of(
            "https://picsum.photos/seed/castle1/800/500",
            "https://picsum.photos/seed/castle2/800/500",
            "https://picsum.photos/seed/castle3/800/500",
            "https://picsum.photos/seed/castle4/800/500"
        )),
        Map.entry("nature",     List.of(
            "https://picsum.photos/seed/nature1/800/500",
            "https://picsum.photos/seed/nature2/800/500",
            "https://picsum.photos/seed/nature3/800/500",
            "https://picsum.photos/seed/nature4/800/500"
        )),
        Map.entry("space",      List.of(
            "https://picsum.photos/seed/space1/800/500",
            "https://picsum.photos/seed/space2/800/500",
            "https://picsum.photos/seed/space3/800/500",
            "https://picsum.photos/seed/space4/800/500"
        )),
        Map.entry("ocean",      List.of(
            "https://picsum.photos/seed/ocean1/800/500",
            "https://picsum.photos/seed/ocean2/800/500",
            "https://picsum.photos/seed/ocean3/800/500",
            "https://picsum.photos/seed/ocean4/800/500"
        )),
        Map.entry("magic",      List.of(
            "https://picsum.photos/seed/magic1/800/500",
            "https://picsum.photos/seed/magic2/800/500",
            "https://picsum.photos/seed/magic3/800/500",
            "https://picsum.photos/seed/magic4/800/500"
        )),
        Map.entry("helping",    List.of(
            "https://picsum.photos/seed/help1/800/500",
            "https://picsum.photos/seed/help2/800/500",
            "https://picsum.photos/seed/help3/800/500",
            "https://picsum.photos/seed/help4/800/500"
        ))
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
