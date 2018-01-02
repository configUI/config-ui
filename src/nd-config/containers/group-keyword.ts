export class GroupKeyword {
    general: { flowpath: { enable: boolean, keywordList: string[] }, hotspot: { enable: boolean, keywordList: string[] }, thread_stats: { enable: boolean, keywordList: string[] }, exception: { enable: boolean, keywordList: string[] }, header: { enable: boolean, keywordList: string[] }, custom_data: { enable: boolean, keywordList: string[] } ,instrumentation_profiles: { enable: boolean, keywordList: string[] }};
    advance: { debug: { enable: boolean, keywordList: string[] }, delay: { enable: boolean, keywordList: string[] }, 
    generate_exception: { enable: boolean, keywordList: string[] }, monitors: { enable: boolean, keywordList: string[] } };
    product_integration: { nvcookie: { enable: boolean, keywordList: string[] } };
}