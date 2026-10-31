#!/usr/bin/env python3
"""Add a small, repeatable demo cookbook without deleting existing records."""
from app import app
from models import db, User, Recipe

RECIPES = [
    ('Slow Sunday tomato pasta', 30, '''A generous bowl of comfort, made with pantry staples and a handful of basil.

## Ingredients · serves 2
- 200 g dried pasta
- 2 tbsp olive oil
- 2 garlic cloves, sliced
- 400 g canned chopped tomatoes
- A handful of fresh basil
- Salt, black pepper, and Parmesan to taste

## Method
1. Warm the oil in a pan over medium heat. Add the garlic and cook gently for one minute.
2. Stir in the tomatoes and a pinch of salt. Simmer for 20 minutes, stirring occasionally.
3. Meanwhile, boil the pasta in salted water until just tender. Reserve a mug of pasta water before draining.
4. Toss the pasta with the sauce, adding a splash of the reserved water to bring it together.
5. Tear over the basil, finish with pepper and Parmesan, and bring straight to the table.'''),
    ('Lemony chickpeas on toast', 15, '''For slow mornings, quick lunches, and all the hungry moments in between.

## Ingredients · serves 2
- 1 tbsp olive oil
- 1 garlic clove, crushed
- 400 g canned chickpeas, drained and rinsed
- 1 lemon, zest and juice
- 2 thick slices of sourdough
- 2 tbsp plain yogurt
- Salt, pepper, and a handful of parsley

## Method
1. Heat the olive oil in a skillet. Add the garlic and stir for 30 seconds.
2. Add the chickpeas with three tablespoons of water and a pinch of salt. Warm for five minutes, then lightly crush some with a fork.
3. Stir through lemon zest, half the juice, and chopped parsley. Taste and adjust the seasoning.
4. Toast the sourdough. Spread with yogurt and spoon the warm chickpeas on top. Finish with the remaining lemon juice and black pepper.'''),
    ('The very good roast potatoes', 55, '''Golden edges, fluffy middles. The side dish that quietly steals the whole dinner.

## Ingredients · serves 4
- 800 g floury potatoes, peeled and cut into chunks
- 3 tbsp olive oil
- 3 garlic cloves, lightly crushed
- 2 sprigs of rosemary
- Salt and black pepper

## Method
1. Heat the oven to 220°C. Put the potatoes into cold salted water, bring to a boil, and simmer for eight minutes.
2. Drain thoroughly and allow the steam to escape for five minutes. Shake gently in the pan to roughen the edges.
3. Toss with oil, garlic, rosemary, salt, and pepper on a spacious roasting tray.
4. Roast for 35 to 40 minutes, turning halfway, until crisp and deeply golden. Season once more before serving.'''),
    ('A little apple crumble', 45, '''A simple pudding for the days that call for something warm from the oven.

## Ingredients · serves 4
- 4 apples, peeled and sliced
- 1 tbsp lemon juice
- 1 tsp cinnamon
- 100 g plain flour
- 60 g cold butter, cubed
- 60 g brown sugar
- 30 g rolled oats

## Method
1. Heat the oven to 190°C. Toss the apples with lemon juice and cinnamon in a small baking dish.
2. Rub the cold butter into the flour with your fingertips until the mixture resembles coarse crumbs.
3. Stir in the sugar and oats, then scatter loosely over the apples without pressing down.
4. Bake for 30 to 35 minutes until the topping is golden and the fruit bubbles at the edges.
5. Let it rest for five minutes and serve with yogurt, cream, or vanilla ice cream.'''),
    ('Green things & herby yogurt', 20, '''A fresh, flexible lunch. Use whichever crisp green vegetables are waiting in your fridge.

## Ingredients · serves 2
- 150 g green beans, trimmed
- 100 g frozen peas
- Half a cucumber, sliced
- 100 g plain yogurt
- 1 tbsp lemon juice
- A small handful of dill or mint, chopped
- 1 tbsp olive oil, salt, and pepper

## Method
1. Boil the green beans in salted water for four minutes. Add the peas for the final minute.
2. Drain and rinse briefly under cold water, then pat dry.
3. Mix the yogurt with lemon juice, herbs, and a pinch of salt.
4. Spread the yogurt on a platter. Arrange the beans, peas, and cucumber over it.
5. Drizzle with olive oil, finish with black pepper, and serve with warm bread.'''),
    ('One-pan butter mushrooms', 25, '''Earthy mushrooms, a little garlic, and buttery pan juices made for mopping up with bread.

## Ingredients · serves 2
- 300 g mushrooms, brushed clean and halved
- 1 tbsp olive oil
- 25 g butter
- 2 garlic cloves, finely chopped
- A small handful of parsley
- 1 tsp lemon juice
- Salt, pepper, and crusty bread

## Method
1. Heat a wide pan over medium-high heat. Add the oil and mushrooms in a single layer.
2. Leave undisturbed for three minutes, then turn and cook until golden and any liquid has evaporated.
3. Lower the heat. Add butter and garlic, stirring for one to two minutes until fragrant.
4. Add lemon juice and chopped parsley. Season to taste and spoon over thick toast, or serve alongside crusty bread.'''),
]

if __name__ == '__main__':
    with app.app_context():
        user = User.query.filter_by(username='demo').first()
        if not user:
            user = User(username='demo', bio='A few favorites from the Reciplease kitchen.')
            user.password_hash = 'reciplease-demo'
            db.session.add(user)
            db.session.flush()
        added = 0
        for title, minutes, instructions in RECIPES:
            if not Recipe.query.filter_by(title=title, user_id=user.id).first():
                db.session.add(Recipe(title=title, minutes_to_complete=minutes, instructions=instructions, user=user))
                added += 1
        db.session.commit()
        print(f'Added {added} recipes. Demo login: demo / reciplease-demo')
