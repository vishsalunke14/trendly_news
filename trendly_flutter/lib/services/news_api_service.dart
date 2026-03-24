import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/api_config.dart';
import '../models/article.dart';

class NewsApiService {
  NewsApiService._();

  static final NewsApiService instance = NewsApiService._();

  Future<List<Article>> fetchTopHeadlines({
    String country = 'in',
    String? category, // now optional
  }) async {
    // Build query params dynamically
    final queryParams = <String, String>{
      'country': country,
      'pageSize': '20',
      'apiKey': newsApiKey,
    };
    if (category != null && category.isNotEmpty) {
      queryParams['category'] = category;
    }

    final uri = Uri.parse('$newsApiBaseUrl/top-headlines')
        .replace(queryParameters: queryParams);

    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception('Failed to load news (${response.statusCode})');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    if (data['status'] != 'ok') {
      final message = data['message'] ?? 'News API error: ${data['status']}';
      throw Exception(message);
    }

    final articlesJson = data['articles'] as List<dynamic>? ?? [];

    return articlesJson
        .map((item) => Article.fromJson(item as Map<String, dynamic>))
        .toList();
  }
}
