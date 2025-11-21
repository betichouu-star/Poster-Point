<?php
header('Content-Type: application/json');

// Security: only allow access to image directories
$allowed_categories = [
    'ANIME',
    'AESTHETICS',
    'CARS',
    'DC',
    'DEVOTIONAL',
    'MARVEL',
    'MOVIE POSTERS',
    'SPORTS',
    'SINGLE STICKERS',
    'FULLPAGE'
];

$category = $_GET['category'] ?? '';

if (!in_array($category, $allowed_categories)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid category']);
    exit;
}

$dir = __DIR__ . "/images/PINTEREST IMAGES/" . $category;

if (!is_dir($dir)) {
    echo json_encode([]);
    exit;
}


$files = scandir($dir);
$images = array_filter($files, function($file) {
    return !in_array($file, ['.', '..']) && 
           preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file);
});

$products = [];
$default_price = 39;
foreach ($images as $file) {
    // Derive id from filename (e.g., AE-045 from AE-045_full.jpg)
    $id = preg_replace('/_.*$/', '', $file); // Remove everything after first underscore
    $id = preg_replace('/\.[^.]+$/', '', $id); // Remove extension
    $name = ucfirst(strtolower($category));
    $products[] = [
        'id' => $id,
        'name' => $name,
        'category' => $category,
        'price' => $default_price,
        'image' => "outputs/$category/$file"
    ];
}

echo json_encode($products);