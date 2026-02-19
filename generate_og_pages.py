#!/usr/bin/env python3
"""
Générateur de pages Open Graph pour les articles KYOOL News

Ce script lit tous les articles dans /media/news/ et génère
des pages HTML statiques avec les balises Open Graph pré-remplies.

Les crawlers des réseaux sociaux peuvent ainsi voir les images et descriptions.
"""

import os
import re
from pathlib import Path

def parse_frontmatter(md_text):
    """Extrait les métadonnées du frontmatter YAML"""
    match = re.match(r'^---\s*(.*?)\s*---\s*(.*)$', md_text, re.DOTALL)
    if not match:
        return {}, md_text
    
    frontmatter = match.group(1)
    body = match.group(2)
    
    meta = {}
    for line in frontmatter.split('\n'):
        line = line.strip()
        if ':' in line:
            key, value = line.split(':', 1)
            meta[key.strip()] = value.strip().strip('"')
    
    return meta, body

def extract_excerpt(body, max_length=200):
    """Extrait un extrait du corps de l'article"""
    # Enlever les balises HTML
    text = re.sub(r'<[^>]+>', '', body)
    # Enlever les espaces multiples
    text = re.sub(r'\s+', ' ', text).strip()
    # Tronquer
    if len(text) > max_length:
        text = text[:max_length].rsplit(' ', 1)[0] + '...'
    return text

def generate_og_page(article_folder, article_id, meta, body):
    """Génère une page HTML avec Open Graph pour un article"""
    
    # Extraire les infos
    title = meta.get('title', 'Article KYOOL')
    journalist = meta.get('journalist', 'KYOOL')
    theme = meta.get('theme', 'Culture')
    date = meta.get('date', '2026-01-01')
    
    # Générer l'extrait
    excerpt = extract_excerpt(body, 200)
    
    # URLs
    base_url = "https://kyool.eu"  # Remplacez par votre vraie URL
    article_url = f"{base_url}/news/news-article.html?id={article_id}"
    image_url = f"{base_url}/media/news/{article_folder}/hero.jpg"
    
    # Description complète
    description = f"{excerpt} | Thème : {theme} | Par {journalist} | KYOOL News"
    
    # Titre complet
    full_title = f"{title} - Par {journalist}"
    
    # Générer le HTML
    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} — KYOOL News</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="KYOOL News">
    <meta property="og:locale" content="fr_FR">
    <meta property="og:title" content="{full_title}">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="{image_url}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="{article_url}">
    <meta property="article:author" content="{journalist}">
    <meta property="article:published_time" content="{date}">
    <meta property="article:section" content="{theme}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{full_title}">
    <meta name="twitter:description" content="{description}">
    <meta name="twitter:image" content="{image_url}">
    
    <!-- Redirection immédiate vers la vraie page -->
    <meta http-equiv="refresh" content="0; url={article_url}">
    <link rel="canonical" href="{article_url}">
    
    <style>
        body {{
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: #0A1628;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }}
        .loading {{
            text-align: center;
            padding: 40px;
        }}
        .loading h1 {{
            font-size: 24px;
            margin-bottom: 20px;
        }}
        .spinner {{
            border: 4px solid rgba(36, 199, 235, 0.1);
            border-top: 4px solid #24C7EB;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }}
        @keyframes spin {{
            0% {{ transform: rotate(0deg); }}
            100% {{ transform: rotate(360deg); }}
        }}
        a {{
            color: #24C7EB;
            text-decoration: none;
            margin-top: 20px;
            display: inline-block;
        }}
    </style>
    
    <script>
        // Redirection JavaScript de secours
        setTimeout(function() {{
            window.location.href = "{article_url}";
        }}, 100);
    </script>
</head>
<body>
    <div class="loading">
        <h1>Chargement de l'article...</h1>
        <div class="spinner"></div>
        <p style="margin-top: 20px; font-size: 14px; opacity: 0.7;">
            Si vous n'êtes pas redirigé automatiquement,
            <a href="{article_url}">cliquez ici</a>
        </p>
    </div>
</body>
</html>
"""
    
    return html

def main():
    """Génère toutes les pages Open Graph"""
    
    # Chemin vers le dossier news
    news_dir = Path("media/news")
    output_dir = Path("news/og")
    
    if not news_dir.exists():
        print(f"❌ Erreur : Le dossier {news_dir} n'existe pas")
        return
    
    # Créer le dossier de sortie
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Parcourir tous les articles
    articles_generated = 0
    
    for article_dir in news_dir.iterdir():
        if not article_dir.is_dir():
            continue
        
        article_md = article_dir / "article.md"
        if not article_md.exists():
            continue
        
        article_id = article_dir.name
        
        try:
            # Lire l'article
            with open(article_md, 'r', encoding='utf-8') as f:
                md_text = f.read()
            
            # Parser
            meta, body = parse_frontmatter(md_text)
            
            # Générer la page OG
            og_html = generate_og_page(article_dir.name, article_id, meta, body)
            
            # Sauvegarder
            output_file = output_dir / f"{article_id}.html"
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(og_html)
            
            print(f"✅ Généré : {output_file}")
            articles_generated += 1
            
        except Exception as e:
            print(f"❌ Erreur avec {article_id}: {e}")
    
    print(f"\n🎉 {articles_generated} pages Open Graph générées dans {output_dir}/")
    print("\n📋 PROCHAINES ÉTAPES :")
    print("1. Uploadez le dossier /news/og/ sur GitHub")
    print("2. Partagez les liens : https://kyool.eu/news/og/article-1.html")
    print("3. Les crawlers verront les images et descriptions ! ✅")

if __name__ == "__main__":
    main()
