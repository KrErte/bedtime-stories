import 'package:flutter/material.dart';

class AppTheme {
  static const navy950 = Color(0xFF080720);
  static const navy900 = Color(0xFF0f0d2e);
  static const navy800 = Color(0xFF1e1b4b);
  static const navy700 = Color(0xFF3730a3);
  static const navy600 = Color(0xFF4f46e5);
  static const navy400 = Color(0xFF7c7df9);
  static const navy300 = Color(0xFFa3a7fd);
  static const storyPurple = Color(0xFF7c3aed);
  static const storyPink = Color(0xFFec4899);
  static const storyGold = Color(0xFFf59e0b);

  static ThemeData get darkTheme => ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: navy950,
    primaryColor: storyPurple,
    colorScheme: const ColorScheme.dark(
      primary: storyPurple,
      secondary: storyPink,
      surface: navy800,
    ),
    fontFamily: 'Inter',
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: true,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: storyPurple,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: navy800,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: navy600),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: navy600),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: storyPurple, width: 2),
      ),
      hintStyle: const TextStyle(color: navy400),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    ),
    cardTheme: CardTheme(
      color: navy800.withOpacity(0.5),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: navy700.withOpacity(0.5)),
      ),
      elevation: 0,
    ),
  );
}
