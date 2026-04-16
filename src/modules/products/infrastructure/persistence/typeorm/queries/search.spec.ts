export class SearchSepecification {
    constructor(private search?: string) { }

    apply(qb) {
        if (this.search) {
            qb.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
                search: `%${this.search}%`,
            });
        }
    }
}